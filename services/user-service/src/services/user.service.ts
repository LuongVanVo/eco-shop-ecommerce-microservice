import { BadRequestError, UnauthorizedRequestError } from "../../../../shared/core/error.response";
import { prisma } from "../config/database.config";
import { hashPassword } from "../utils/hashPassword";
import bcrypt from 'bcrypt';
import userRepository from "../models/repository/user.repository";
import crypto from 'crypto'
import { createTokenPair } from "../utils/authUtils";
import jwt, { SignOptions } from "jsonwebtoken";
import { profileUserInstance } from "../models/profileUserModel";
import dotenv from 'dotenv';
import { transporter } from "../helpers/transporter";
import { getInfoData } from "../utils/getInfoData";
import { uploadImageHelper } from "../helpers/uploadImageCloudinary";
import { access } from "fs";
dotenv.config()

class UserService {

    static register = async (name: string, email: string, password: string, confirmPassword: string) => {
        // check email exists
        const emailExist = await userRepository.findEmailExist(email)
        if (emailExist) throw new BadRequestError('Error: User already exists !!!')

        if (password !== confirmPassword) throw new BadRequestError('Error: Passwords do not match !!!')

        // hash password
        const hashedPassword = await hashPassword(password);
        // create user
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        })

        const { password: _, ...userWithoutPassword } = newUser
        return userWithoutPassword
    }
    
    static login = async (email: string, password: string) => {
        // check email in dbs
        const foundUser = await userRepository.findEmailExist(email)
        if (!foundUser) throw new BadRequestError('Please check the email or password')

        // match password
        const matchPassword = await bcrypt.compare(password, foundUser.password)
        if (!matchPassword) throw new UnauthorizedRequestError('Please check the email or password')
        
        // Tạo cặp khóa privateKey và publicKey để ký token JWT
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }, 
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        })

        // Tạo cặp access token và refresh token
        const userId = (foundUser.id).toString()
        const tokenPair = await createTokenPair(
            { userId, email }, 
            publicKey, 
            privateKey
        )

        const { accessToken, refreshToken } = tokenPair
        // hash refresh token và lưu vào db
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
        // save refresh token and publicKey to database
        await prisma.refreshToken.create({
            data: {
                userId: foundUser.id,
                tokenHash: refreshTokenHash,
                publicKey: publicKey,
                userAgent: '',
                ipAddress: '',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                revoked: false
            }
        })
        const { password: _, ...userWithoutPassword } = foundUser
        return {
            user: userWithoutPassword,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    }

    static logout = async (refreshToken: string) => {
        // find refresh token in db
        const foundRefreshToken = await prisma.refreshToken.findFirst({
            where: {
                tokenHash: crypto.createHash('sha256').update(refreshToken).digest('hex'),
            }
        })
        if (!foundRefreshToken) throw new BadRequestError('Invalid refresh token')

        // update revoked = TRUE, đánh dấu token đã bị thu hồi
        await prisma.refreshToken.update({
            where: {
                id: foundRefreshToken.id
            },
            data: {
                revoked: true
            }
        })
    }

    // quên mật khẩu 
    static forgotPassword = async (email: string) => {
        // find email exist ?
        const foundEmail = await userRepository.findEmailExist(email)
        if (!foundEmail) 
            throw new BadRequestError('Error: Email not found !!')

        const payload = {
            userId: foundEmail.id,
            email: foundEmail.email
        }

        // Tạo token reset mật khẩu
        const JWT_SECRET = process.env.JWT_SECRET_AUTH as string
        
        const options: SignOptions = {
            expiresIn: 10 * 60 // 10 minutes in seconds
        }

        const resetToken = jwt.sign(payload, JWT_SECRET, options)

        // lưu token vào db
        await prisma.passwordReset.create({
            data: {
                userId: foundEmail.id,
                token: resetToken,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                used: false,
                createdAt: new Date()
            }
        })

        // send email chứa link reset mật khẩu
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: foundEmail.email,
            subject: 'Password Reset Request',
            html:   `<p>Your reset token is:<strong>${resetToken}</strong></p>`
        }
        await transporter.sendMail(mailOptions)

        return getInfoData(['email', 'createdAt'], foundEmail)
    }

    // đổi mật khẩu 
    static resetPassword = async (resetToken: string, email: string, newPassword: string, confirmPassword: string) => {
        // check resetToken and email valid ??
        const resetUser = await prisma.passwordReset.findFirst({
            where: {
                token: resetToken,
                used: false,
                expiresAt : { gt: new Date() },
                user: {
                    email: email
                }
            },
            include: {
                user: true
            }
        })
        if (!resetUser) throw new BadRequestError('Invalid token or email !!')

        // update password
        if (newPassword !== confirmPassword) 
            throw new BadRequestError('Error: Passwords do not match !!!')

        const hashedPassword = await hashPassword(newPassword)

        await prisma.user.update({
            where: {
                id: resetUser.userId
            },
            data: {
                password: hashedPassword,
                updatedAt: new Date(),
            }
        })

        // đánh dấu token đã sử dụng
        await prisma.passwordReset.update({
            where: {
                id: resetUser.id
            },
            data: {
                used: true,
            }
        })

        // Trả về thông tin user
        return getInfoData(['email', 'updatedAt'], resetUser.user)
    }

    // upload profile
    static uploadProfile = async (profileUserInstance: any) => {
        if (!profileUserInstance) throw new BadRequestError('No profile data provided')

        const imageUrl = await uploadImageHelper(profileUserInstance.avatarUrl)
        const newProfile = await prisma.profile.create({
            data: {
                userId: profileUserInstance.userId,
                address: profileUserInstance.address,
                phone: profileUserInstance.phone,
                avatarUrl: imageUrl
            }
        })

        if (!newProfile) throw new BadRequestError('Error creating profile')

        return getInfoData(['id', 'userId', 'address', 'phone', 'avatarUrl', 'createdAt', 'updatedAt'], newProfile)
    }

    // refresh access token bằng refresh token
    /* 
        1. Hash refresh token để tìm trong db
        2. Tìm refresh token trong db
        3. Verify refresh token với publickey 
        4. Tạo accesstoken mới  (giữ nguyên refresh token)
        5. Tạo access token mới
        6. Update publickey trong db (cho access token mới)
    */
   static refreshAccessToken = async (refreshToken: string) => {
        console.log('Refresh token:', refreshToken);
        if (!refreshToken) throw new BadRequestError('No refresh token provided')
            
        // 1. Hash Refresh Token
        const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex')

        // 2. Tìm refresh token trong db
        const refreshTokenFound = await prisma.refreshToken.findFirst({
            where: {
                tokenHash: hashedRefreshToken,
                revoked: false,
                expiresAt: { gt: new Date() } // Chưa hết hạn
            },
            include: {
                user: true
            }
        })

        if (!refreshTokenFound) throw new UnauthorizedRequestError(`Invalid or expired refresh token`)

        // 3. Verify refresh token với public key 
        const payload = jwt.verify(refreshToken, refreshTokenFound.publicKey, {
            algorithms: ['RS256']
        })

        // 4. Tạo access token mới (Giữ nguyên refresh token)
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        })

        // 5. Tạo access token mới
        const newTokenPair = await createTokenPair(
            { userId: (payload as any).userId, email: (payload as any).email },
            publicKey,
            privateKey
        )

        // 6. Update publicKey trong db (cho access token mới)
        await prisma.refreshToken.update({
            where: {
                id: refreshTokenFound.id
            },
            data: {
                publicKey: publicKey
            }
        })

        return {
            user: getInfoData(['id', 'email', 'name', 'role'], refreshTokenFound.user),
            accessToken: newTokenPair.accessToken,
            refreshToken: refreshToken // giữ nguyên refresh token cũ
        }
   }
}
    
export default UserService
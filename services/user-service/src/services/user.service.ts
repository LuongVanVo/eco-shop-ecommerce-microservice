import { BadRequestError, UnauthorizedRequestError } from "../../../../shared/core/error.response";
import { prisma } from "../config/database.config";
import { hashPassword } from "../utils/hashPassword";
import bcrypt from 'bcrypt';
import userRepository from "../models/repository/user.repository";
import crypto from 'crypto'
import { createTokenPair } from "../utils/authUtils";

import dotenv from 'dotenv';
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
}
    
export default UserService
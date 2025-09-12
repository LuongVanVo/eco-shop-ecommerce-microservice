// middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.config";
import crypto from 'crypto';
import { JWTPayload } from "../../types/interface";
import {} from "../../types/express";

// xác thực access token truyền trong header Authorization

/*
1. Lấy access token từ header Authorization
2. Giải mã token để lấy userId (không verify)
3. Lấy publicKey từ database dựa vào userId
4. Verify access token với publicKey
*/

export const authAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false,
                message: "Missing or invalid access token" 
            });
        }

        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token format" 
            });
        }

        // 1. Decode token để lấy userId (không verify)
        const decodedUnverified = jwt.decode(accessToken) as any;
        if (!decodedUnverified || !decodedUnverified.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token structure"
            });
        }

        console.log('Token userId:', decodedUnverified.userId); // Debug

        // 2. Lấy publicKey từ database dựa vào userId
        const refreshTokenRecord = await prisma.refreshToken.findFirst({
            where: {
                userId: Number(decodedUnverified.userId),
                revoked: false,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' } // Lấy session mới nhất
        });

        if (!refreshTokenRecord) {
            return res.status(401).json({
                success: false,
                message: "Token session not found or expired"
            });
        }
        // 3. Verify access token với publicKey
        let decoded: JWTPayload;
        try {
            decoded = jwt.verify(accessToken, refreshTokenRecord.publicKey, { 
                algorithms: ['RS256'] 
            }) as JWTPayload;
            
        } catch (jwtError: any) {            
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token"
                });
            }
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Access token has expired"
                });
            }
            
            return res.status(401).json({
                success: false,
                message: "Token verification failed"
            });
        }

        // 4. Lấy thông tin user
        const user = await prisma.user.findFirst({
            where: { id: Number(decoded.userId) },
            select: { 
                id: true, 
                email: true, 
                name: true, 
                role: true 
            }
        });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "User not found or has been deactivated" 
            });
        }

        // 5. Verify email matches
        if (user.email !== decoded.email) {
            return res.status(401).json({
                success: false,
                message: "Token user mismatch"
            });
        }

        // 6. Attach user and token to request
        req.user = user;
        req.token = accessToken;

        
        next(); 

    } catch (error: any) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error during authentication",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
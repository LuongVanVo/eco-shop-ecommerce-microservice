// middleware/resetTokenMiddleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.config';

// Extend Request interface để TypeScript hiểu
declare global {
    namespace Express {
        interface Request {
            resetToken?: string;
            resetPayload?: {
                userId: string;
                email: string;
                purpose?: string;
            };
        }
    }
}

export const resetTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Check Authorization header
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false,
                message: "Missing reset token in Authorization header" 
            });
        }
        
        const resetToken = authHeader.split(" ")[1];
        if (!resetToken) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token format" 
            });
        }

        // 2. Verify JWT token
        const JWT_SECRET = process.env.JWT_SECRET_AUTH;
        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }
        
        let decoded: any;
        try {
            decoded = jwt.verify(resetToken, JWT_SECRET);
        } catch (error: any) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid reset token"
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Reset token has expired"
                });
            }
            return res.status(401).json({
                success: false,
                message: "Token verification failed"
            });
        }

        // 3. Check if token exists in database and is not used
        const resetRecord = await prisma.passwordReset.findFirst({
            where: {
                token: resetToken,
                used: false,
                expiresAt: {
                    gt: new Date() // Not expired
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        if (!resetRecord) {
            return res.status(401).json({
                success: false,
                message: "Invalid, expired, or already used reset token"
            });
        }

        // 4. Verify email from request body matches token
        const { email } = req.body;
        if (email && resetRecord.user.email !== email) {
            return res.status(401).json({
                success: false,
                message: "Email does not match reset token"
            });
        }

        // 5. Attach token and payload to request
        req.resetToken = resetToken;
        req.resetPayload = {
            userId: decoded.userId,
            email: decoded.email,
            purpose: decoded.purpose
        };

        console.log(`✅ Reset token verified for user: ${resetRecord.user.email}`);
        
        next(); // Continue to next middleware/controller

    } catch (error: any) {
        console.error('Reset token middleware error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during token verification",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
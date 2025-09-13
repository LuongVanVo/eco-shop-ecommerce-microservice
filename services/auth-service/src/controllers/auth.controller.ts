import AuthService from "../services/auth.service";
import { SuccessResponse } from '../../../../shared/core/success.response'
import { NextFunction, Request, Response } from 'express';
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';

class AuthController {
    register = async (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            })
        }

        const { name, email, password, confirmPassword } = req.body as { name: string; email: string; password: string; confirmPassword: string };
        const user = await AuthService.register(name, email, password, confirmPassword);
        return new SuccessResponse({
            message: 'Register successfully',
            metadata: user
        }).send(res);   
    }

    login = async (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            })
        }

        const { email, password } = req.body as { email: string; password: string };
        const user = await AuthService.login(email, password);
        return new SuccessResponse({
            message: 'Login successfully',
            metadata: user
        }).send(res);
    }

    logout = async (req: Request, res: Response, next: any) => {
        // refresh token được truyền ở bearer token
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing refresh token" });
        }

        const refreshToken = authHeader.split(" ")[1] as string;

        await AuthService.logout(refreshToken);
        return new SuccessResponse({
            message: 'Logout successfully',
        }).send(res);
    }

    forgotPassword = async (req: Request, res: Response, next: any) => {
        const { email } = req.body as { email: string }
        const data = await AuthService.forgotPassword(email)
        return new SuccessResponse({
            message: 'Reset token sent to your email',
            metadata: data
        }).send(res)
    }

    resetPassword = async (req: Request, res: Response, next: any) => {
        const { email, newPassword, confirmPassword } = req.body;
        
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email, newPassword, confirmPassword'
            });
        }

        const resetToken = req.resetToken!;
        
        const data = await AuthService.resetPassword(resetToken, email, newPassword, confirmPassword);
        
        return new SuccessResponse({
            message: "Password reset successfully.",
            metadata: data
        }).send(res);
    }

    refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = (req as any).token

        const data = await AuthService.refreshAccessToken(refreshToken)

        return new SuccessResponse ({
            message: "Access token refreshed successfully",
            metadata: data
        }).send(res)
    }
}

export default new AuthController();
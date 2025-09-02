import UserService from "../services/user.service";
import { SuccessResponse } from '../../../../shared/core/success.response'
import { Request, Response } from 'express';
import { validationResult } from "express-validator";

class UserController {
    register = async (req: Request, res: Response, next: any) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                })
            }

            const { name, email, password, confirmPassword } = req.body as { name: string; email: string; password: string; confirmPassword: string };
            const user = await UserService.register(name, email, password, confirmPassword);
            return new SuccessResponse({
                message: 'Register successfully',
                metadata: user
            }).send(res);
        } catch (error : any) {
            return res.status(400).json({ error: error.message });
        }
    }

    login = async (req: Request, res: Response, next: any) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                })
            }

            const { email, password } = req.body as { email: string; password: string };
            const user = await UserService.login(email, password);
            return new SuccessResponse({
                message: 'Login successfully',
                metadata: user
            }).send(res);
        } catch (error : any) {
            return res.status(400).json({ error: error.message });
        }
    }

    logout = async (req: Request, res: Response, next: any) => {
        try {
            // refresh token được truyền ở bearer token
            const authHeader = req.headers["authorization"];
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Missing refresh token" });
            }

            const refreshToken = authHeader.split(" ")[1] as string;

            await UserService.logout(refreshToken);
            return new SuccessResponse({
                message: 'Logout successfully',
            }).send(res);
        } catch (error : any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new UserController();
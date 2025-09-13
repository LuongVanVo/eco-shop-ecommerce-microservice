import UserService from "../services/user.service";
import { SuccessResponse } from "../../../../shared/core/success.response";
import { Request, Response, NextFunction } from "express";

class UserController {
    updateProfile = async (req: Request, res: Response, next: any) => {
        // userId lấy từ middleware xác thực
        const userId = req.user?.id!
        const token = req.token

        const profileData = {
            userId: userId,
            ...req.body
        }

        const data = await UserService.uploadProfile(profileData)
        return new SuccessResponse({
            message: "Profile updated successfully !!",
            metadata: data
        }).send(res)
    }
}

export default new UserController();
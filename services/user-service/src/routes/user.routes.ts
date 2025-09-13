import UserController from "../controllers/user.controller";
import express from 'express';
import { asyncHandler } from "../helpers/asyncHandler";
import { authAccessTokenMiddleware } from "../middleware/authMiddleware";
import { errorHandler } from "../middleware/errorHandler";

const router = express.Router()

router.patch('/update-profile', authAccessTokenMiddleware, asyncHandler(UserController.updateProfile))

router.use(errorHandler)

export default router
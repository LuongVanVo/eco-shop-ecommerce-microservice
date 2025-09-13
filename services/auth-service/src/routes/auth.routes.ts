import AuthController from "../controllers/auth.controller";
import express from 'express'
import { check, checkSchema } from "express-validator";
import { validateSignup, validateLogin } from "../middleware/validationInput";
import { validateRefreshTokenMiddleware } from "../utils/authToken";
import { asyncHandler } from '../helpers/asyncHandler'
import { errorHandler } from "../middleware/errorHandler";
import { resetTokenMiddleware } from "../middleware/authResetTokenMiddleware";
import { authAccessTokenMiddleware } from "../middleware/authMiddleware";

const router = express.Router()

router.post('/signup', checkSchema(validateSignup), asyncHandler(AuthController.register))
router.post('/login', checkSchema(validateLogin), asyncHandler(AuthController.login))
router.post('/logout', validateRefreshTokenMiddleware, asyncHandler(AuthController.logout))

router.post('/forgot-password', asyncHandler(AuthController.forgotPassword))
router.post('/reset-password', resetTokenMiddleware, asyncHandler(AuthController.resetPassword))

router.post('/refresh-accessToken', validateRefreshTokenMiddleware, asyncHandler(AuthController.refreshAccessToken))

router.use(errorHandler)

export default router
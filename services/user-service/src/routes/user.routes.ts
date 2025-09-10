import UserController from "../controllers/user.controller";
import express from 'express'
import { check, checkSchema } from "express-validator";
import { validateSignup, validateLogin } from "../middleware/validationInput";
import { validateRefreshTokenMiddleware } from "../utils/authToken";
import { asyncHandler } from '../helpers/asyncHandler'
import { errorHandler } from "../middleware/errorHandler";
import { resetTokenMiddleware } from "../middleware/authMiddleware";

const router = express.Router()

router.post('/signup', checkSchema(validateSignup), asyncHandler(UserController.register))
router.post('/login', checkSchema(validateLogin), asyncHandler(UserController.login))
router.post('/logout', validateRefreshTokenMiddleware, asyncHandler(UserController.logout))

router.post('/forgot-password', asyncHandler(UserController.forgotPassword))
router.post('/reset-password', resetTokenMiddleware, asyncHandler(UserController.resetPassword))

router.use(errorHandler)

export default router
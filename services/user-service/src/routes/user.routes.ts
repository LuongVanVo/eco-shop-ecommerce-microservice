import UserController from "../controllers/user.controller";
import express from 'express'
import { check, checkSchema } from "express-validator";
import { validateSignup, validateLogin } from "../middleware/validationInput";
import { validateRefreshTokenMiddleware } from "../utils/authToken";
import { asyncHandler } from '../helpers/asyncHandler'
import { errorHandler } from "../middleware/errorHandler";

const router = express.Router()

router.post('/signup', checkSchema(validateSignup), asyncHandler(UserController.register))
router.post('/login', checkSchema(validateLogin), asyncHandler(UserController.login))
router.post('/logout', validateRefreshTokenMiddleware, asyncHandler(UserController.logout))

router.use(errorHandler)

export default router
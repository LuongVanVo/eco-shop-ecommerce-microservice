import UserController from "../controllers/user.controller";
import express from 'express'
import { check, checkSchema } from "express-validator";
import { validateSignup, validateLogin } from "../middleware/validationInput";
import { validateRefreshTokenMiddleware } from "../utils/authToken";

const router = express.Router()

router.post('/signup', checkSchema(validateSignup), UserController.register)
router.post('/login', checkSchema(validateLogin), UserController.login)
router.post('/logout', validateRefreshTokenMiddleware, UserController.logout)

export default router
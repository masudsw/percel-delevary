import { Router } from "express";
import { AuthController } from "./auth.controller";
import { valiateRequest } from "../../middleware/validateRequest";
import { loginUserZodSchema } from "./auth.validation";

const router=Router()
router.post('/login',
    valiateRequest(loginUserZodSchema),
    AuthController.login)
export const AuthRouter=router
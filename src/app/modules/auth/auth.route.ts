import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { valiateRequest } from "../../middleware/validateRequest";
import { loginUserZodSchema } from "./auth.validation";
import passport from "passport";
import { envVars } from "../../config/env";

const router=Router()
router.post('/login',
    valiateRequest(loginUserZodSchema),
    AuthController.credentialLogin),
router.get("/google",async(req:Request,res:Response,next:NextFunction)=>{
    const redirect=req.query.redirect || "/"
    passport.authenticate("google",{scope:["profile","email"],state:redirect as string})(req,res,next)
})
router.get("/google/callback",passport.authenticate("google",{failureRedirect:`${envVars.FRONTEND_URL}/login?error=Error ocurred. Contact with support team!`}),AuthController.googleCallbackController)
router.post("/forgot-password",AuthController.forgotPassword)
router.post('/logout',AuthController.logout)
export const AuthRouter=router
import express from "express"
import { UserController } from "./user.controller"
import { valiateRequest } from "../../middleware/validateRequest"
import { createUserZodSchema } from "./user.validation"
const router=express.Router()
router.post("/register",
    valiateRequest(createUserZodSchema),
    UserController.createUser)
export const UserRouter=router
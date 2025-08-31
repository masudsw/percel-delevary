import express from "express"
import { UserController } from "./user.controller"
import { valiateRequest } from "../../middleware/validateRequest"
import { createUserZodSchema } from "./user.validation"
import { checkAuth } from "../../middleware/checkAuth"
import { UserType } from "./user.interface"
const router = express.Router()
router.post("/register",
    valiateRequest(createUserZodSchema),
    UserController.createUser)
router.patch('/:email/block',
    checkAuth(UserType.ADMIN),
    UserController.userBlockUpdate)
router.get("/me", 
    checkAuth(...Object.values(UserType)), 
    UserController.getMe)


export const UserRouter = router
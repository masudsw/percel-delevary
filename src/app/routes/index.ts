import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";

export const router=Router()


router.use("/user",UserRouter)
// router.use("/percel",PercelRouter)
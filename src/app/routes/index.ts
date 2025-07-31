import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { ParcelRouter } from "../modules/percel/percel.route";

export const router=Router()


router.use("/user",UserRouter)
router.use("/auth",AuthRouter)
router.use("/parcel",ParcelRouter)
// router.use("/percel",PercelRouter)
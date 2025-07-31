import express from "express"

import { valiateRequest } from "../../middleware/validateRequest"
import { ParcelController } from "./parcel.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { UserType } from "../user/user.interface"

const router=express.Router()
router.post("/newparcel",
    // valiateRequest(createPercelZodSchema),
    checkAuth(UserType.ADMIN,UserType.SENDER),
    ParcelController.createParcel)
export const ParcelRouter=router
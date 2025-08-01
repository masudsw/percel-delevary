import express from "express"

import { valiateRequest } from "../../middleware/validateRequest"
import { ParcelController } from "./parcel.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { UserType } from "../user/user.interface"
import { adminUpdateParcelZodSchema, createParcelZodSchema, parcelTarckingZodSchema } from "./percel.validation"

const router = express.Router()
router.post("/newparcel",
    valiateRequest(createParcelZodSchema),
    checkAuth(UserType.SENDER),
    ParcelController.createParcel)
router.patch(
    '/:trackingId/status/intransit',
    checkAuth(UserType.ADMIN),
    ParcelController.inTransitParcel
);

router.patch(
    '/:trackingId/status/mark-received',
    checkAuth(UserType.RECEIVER),
    ParcelController.markAsReceived
);
router.patch(
    '/:trackingId',
    valiateRequest(adminUpdateParcelZodSchema),
    checkAuth(UserType.ADMIN),
    ParcelController.pickParcel

)
router.get(
    '/:trackingId/status',
    // valiateRequest(parcelTarckingZodSchema),
    ParcelController.parcelStatus
)

export const ParcelRouter = router
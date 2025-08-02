import express from "express"

import { valiateRequest } from "../../middleware/validateRequest"
import { ParcelController } from "./parcel.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { UserType } from "../user/user.interface"
import { adminUpdateParcelZodSchema, createParcelZodSchema, parcelTarckingZodSchema } from "./percel.validation"
import { Parcel } from "./percel.model"
import { queryBuilder } from "../../middleware/queryBuilder"

const router = express.Router()
router.post("/newparcel",
    valiateRequest(createParcelZodSchema),
    checkAuth(UserType.SENDER),
    ParcelController.createParcel)
router.get(
    '/',
    checkAuth(UserType.ADMIN),
    queryBuilder(Parcel, ['receiverName', 'description']),
    ParcelController.getAllParcel
);
router.get(
    '/:id',
    checkAuth(UserType.SENDER),
    ParcelController.getMyPercels  
)
router.patch(
    '/:trackingId/status/cancel',
    checkAuth(UserType.SENDER,UserType.ADMIN),
    ParcelController.cancelParcel
);
router.patch(
    '/:trackingId/status/intransit',
    checkAuth(UserType.ADMIN),
    ParcelController.inTransitParcel
);

router.patch(
    '/:trackingId/status/mark-received',
    checkAuth(UserType.RECEIVER),
    ParcelController.deliverParcel
);
router.patch(
    '/:trackingId/status/mark-picked',
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
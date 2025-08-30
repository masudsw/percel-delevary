import express from "express"

import { valiateRequest } from "../../middleware/validateRequest"
import { ParcelController } from "./parcel.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { UserType } from "../user/user.interface"
import { adminUpdateParcelZodSchema, createParcelZodSchema } from "./percel.validation"
import { Parcel } from "./percel.model"
import { queryBuilder } from "../../middleware/queryBuilder"

const router = express.Router()
router.post("/newparcel",
    valiateRequest(createParcelZodSchema),
    checkAuth(UserType.SENDER),
    ParcelController.createParcel);
router.get(
    '/',
    checkAuth(UserType.ADMIN),
    queryBuilder(Parcel, ['receiverName', 'description','currentStatus']),
    ParcelController.getAllParcel
);
router.get(
    '/ready-to-receive',
    checkAuth(UserType.RECEIVER),
    ParcelController.getReceiverParcel
);
router.get(
    '/myParcel',
    checkAuth(UserType.SENDER),
    ParcelController.getMyPercels

);
router.get(
    '/:id',
    checkAuth(UserType.SENDER),
    ParcelController.getMyPercels  
);
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
);
router.get(
    '/:trackingId/status',
    // valiateRequest(parcelTarckingZodSchema),
    ParcelController.parcelStatus
);




export const ParcelRouter = router
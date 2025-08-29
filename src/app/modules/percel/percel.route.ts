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
    (req,res,next)=>{
        console.log("mark-received\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\jjhjh")
        console.log("url",req.baseUrl)
        console.log("body data",req.body)
        next()
    },
    checkAuth(UserType.RECEIVER),
    (req,res,next)=>{
        console.log("checkAuth passing")
        console.log("body data",req.body)
        next()
    },
    ParcelController.deliverParcel
);
router.patch(
    '/:trackingId/status/mark-picked',
    (req,res,next)=>{
        // console.log('------incoming request-----------------------')
        // console.log('Method',req.method);
        // console.log('url:',req.originalUrl);
        // console.log('body data',req.body)
        next();
    },
    valiateRequest(adminUpdateParcelZodSchema),
    (req,res,next)=>{
        console.log("After validaterequest. passed validatiion.")
        next()
    },
    checkAuth(UserType.ADMIN),
    (req,res,next)=>{
        console.log("After checkAuth. passed userAuthentication")
        next()
    },
    ParcelController.pickParcel
);
router.get(
    '/:trackingId/status',
    // valiateRequest(parcelTarckingZodSchema),
    ParcelController.parcelStatus
);




export const ParcelRouter = router
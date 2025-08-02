"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middleware/validateRequest");
const parcel_controller_1 = require("./parcel.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const percel_validation_1 = require("./percel.validation");
const percel_model_1 = require("./percel.model");
const queryBuilder_1 = require("../../middleware/queryBuilder");
const router = express_1.default.Router();
router.post("/newparcel", (0, validateRequest_1.valiateRequest)(percel_validation_1.createParcelZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.UserType.SENDER), parcel_controller_1.ParcelController.createParcel);
router.get('/', (0, checkAuth_1.checkAuth)(user_interface_1.UserType.ADMIN), (0, queryBuilder_1.queryBuilder)(percel_model_1.Parcel, ['receiverName', 'description']), parcel_controller_1.ParcelController.getAllParcel);
router.get('/:id', (0, checkAuth_1.checkAuth)(user_interface_1.UserType.SENDER), parcel_controller_1.ParcelController.getMyPercels);
router.patch('/:trackingId/status/cancel', (0, checkAuth_1.checkAuth)(user_interface_1.UserType.SENDER, user_interface_1.UserType.ADMIN), parcel_controller_1.ParcelController.cancelParcel);
router.patch('/:trackingId/status/intransit', (0, checkAuth_1.checkAuth)(user_interface_1.UserType.ADMIN), parcel_controller_1.ParcelController.inTransitParcel);
router.patch('/:trackingId/status/mark-received', (0, checkAuth_1.checkAuth)(user_interface_1.UserType.RECEIVER), parcel_controller_1.ParcelController.deliverParcel);
router.patch('/:trackingId/status/mark-picked', (0, validateRequest_1.valiateRequest)(percel_validation_1.adminUpdateParcelZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.UserType.ADMIN), parcel_controller_1.ParcelController.pickParcel);
router.get('/:trackingId/status', 
// valiateRequest(parcelTarckingZodSchema),
parcel_controller_1.ParcelController.parcelStatus);
exports.ParcelRouter = router;

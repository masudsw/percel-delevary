"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelTarckingZodSchema = exports.adminUpdateParcelZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
exports.createParcelZodSchema = zod_1.z.object({
    receiverName: zod_1.z
        .string()
        .min(1, "Receiver name is required")
        .min(2, "Receiver name must be at least 2 characters long")
        .max(100, "Receiver name must not exceed 100 characters")
        .trim(),
    receiverPhone: zod_1.z
        .string()
        .min(1, "Phone number is required")
        .regex(/^(?:\+?88|0088)?01[3-9]\d{8}$/, {
        message: "Must be a valid Bangladeshi phone number (01XXXXXXXXX format)"
    }),
    originAddress: zod_1.z.object({
        address: zod_1.z
            .string()
            .min(1, "Address is required")
            .min(5, "Address must be at least 5 characters long")
            .max(200, "Address must not exceed 200 characters"),
        district: zod_1.z
            .string()
            .min(1, "District is required")
            .max(50, "District must not exceed 50 characters"),
        country: zod_1.z
            .string()
            .min(1, "Country is required")
            .max(50, "Country must not exceed 50 characters")
    }),
    destinationAddress: zod_1.z.object({
        address: zod_1.z
            .string()
            .min(1, "Address is required")
            .min(5, "Address must be at least 5 characters long")
            .max(200, "Address must not exceed 200 characters"),
        district: zod_1.z
            .string()
            .min(1, "District is required")
            .max(50, "District must not exceed 50 characters"),
        country: zod_1.z
            .string()
            .min(1, "Country is required")
            .max(50, "Country must not exceed 50 characters")
    }),
    dimentions: zod_1.z.object({
        height: zod_1.z
            .number()
            .min(0.1, "Height must be at least 0.1")
            .max(200, "Height must not exceed 200"),
        width: zod_1.z
            .number()
            .min(0.1, "Width must be at least 0.1")
            .max(200, "Width must not exceed 200"),
        length: zod_1.z
            .number()
            .min(0.1, "Length must be at least 0.1")
            .max(200, "Length must not exceed 200")
    }),
    description: zod_1.z
        .string()
        .min(1, "Description is required")
        .min(10, "Description must be at least 10 characters long")
        .max(500, "Description must not exceed 500 characters"),
    weight: zod_1.z
        .number()
        .min(0.1, "Width must be at least 0.1")
        .max(20, "Width must not exceed 200"),
    currentStatus: zod_1.z
        // .enum(["REQUESTED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "CANCELLED"])
        .enum(Object.values(parcel_interface_1.STATUS))
        .default(parcel_interface_1.STATUS.REQUESTED),
    shippingFee: zod_1.z.undefined(), // Explicitly prevent this field in creation
    estimatedDeliveryDate: zod_1.z.undefined() // Explicitly prevent this field in creation
});
exports.adminUpdateParcelZodSchema = zod_1.z.object({
    receiverName: zod_1.z.string().min(2).max(100).optional(),
    receiverPhone: zod_1.z.string().regex(/^(?:\+?88|0088)?01[3-9]\d{8}$/).optional(),
    destinationAddress: zod_1.z.object({
        address: zod_1.z.string().min(5).max(200),
        district: zod_1.z.string().min(1).max(50),
        country: zod_1.z.string().min(1).max(50)
    }).optional(),
    weight: zod_1.z.number().min(0.1).optional(),
    estimatedDeliveryDate: zod_1.z.string()
        .datetime({
        message: "Invalid ISO 8601 date format. Use format: YYYY-MM-DDTHH:MM:SSZ"
    })
        .refine(dateStr => new Date(dateStr) > new Date(), "Delivery date must be in the future")
        .transform(dateStr => new Date(dateStr)),
    shippingFee: zod_1.z.number()
        .min(0, "Shipping fee cannot be negative")
        .max(10000, "Shipping fee cannot exceed 10,000")
        .refine(val => {
        // Convert to fixed decimal and back to check precision
        const decimalPlaces = (val.toString().split('.')[1] || '').length;
        return decimalPlaces <= 2;
    }, "Shipping fee can have maximum 2 decimal places"),
    notes: zod_1.z.string().min(1, "Update notes are required") // Require admin to explain changes
}).strict();
exports.parcelTarckingZodSchema = zod_1.z.object({
    trackingId: zod_1.z.string()
        .length(16, "Tracking ID must be exactly 16 characters")
        .regex(/^TRK-[A-Z0-9]{12}$/, // Format: TRK- + 12 alphanums
    "Format: TRK- followed by 12 uppercase letters/numbers")
        .transform(val => val.toUpperCase())
});

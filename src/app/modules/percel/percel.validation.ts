import { z } from "zod";
import { STATUS } from "./parcel.interface";

export const createParcelZodSchema = z.object({
    receiverName: z
        .string()
        .min(1, "Receiver name is required")
        .min(2, "Receiver name must be at least 2 characters long")
        .max(100, "Receiver name must not exceed 100 characters")
        .trim(),

    receiverPhone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^(?:\+?88|0088)?01[3-9]\d{8}$/, {
            message: "Must be a valid Bangladeshi phone number (01XXXXXXXXX format)"
        }),

    originAddress: z.object({
        address: z
            .string()
            .min(1, "Address is required")
            .min(5, "Address must be at least 5 characters long")
            .max(200, "Address must not exceed 200 characters"),
        district: z
            .string()
            .min(1, "District is required")
            .max(50, "District must not exceed 50 characters"),
        country: z
            .string()
            .min(1, "Country is required")
            .max(50, "Country must not exceed 50 characters")
    }),

    destinationAddress: z.object({
        address: z
            .string()
            .min(1, "Address is required")
            .min(5, "Address must be at least 5 characters long")
            .max(200, "Address must not exceed 200 characters"),
        district: z
            .string()
            .min(1, "District is required")
            .max(50, "District must not exceed 50 characters"),
        country: z
            .string()
            .min(1, "Country is required")
            .max(50, "Country must not exceed 50 characters")
    }),

    dimentions: z.object({
        height: z
            .number()
            .min(0.1, "Height must be at least 0.1")
            .max(200, "Height must not exceed 200"),
        width: z
            .number()
            .min(0.1, "Width must be at least 0.1")
            .max(200, "Width must not exceed 200"),
        length: z
            .number()
            .min(0.1, "Length must be at least 0.1")
            .max(200, "Length must not exceed 200")
    }),

    description: z
        .string()
        .min(1, "Description is required")
        .min(10, "Description must be at least 10 characters long")
        .max(500, "Description must not exceed 500 characters"),

    shippingFee: z
        .number()
        .min(0, "Shipping fee cannot be negative")
        .optional(),

    estimatedDeliveryDate: z
        .string()
        .optional(),
    currentStatus: z
        // .enum(["REQUESTED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "CANCELLED"])
        .enum(Object.values(STATUS))
        .default(STATUS.REQUESTED)

});
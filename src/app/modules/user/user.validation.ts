import { z } from "zod";
import { UserType } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be a string" })
    .min(1, "Name is required")  // Required validation
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must not exceed 50 characters." })
    .trim(),
  userType: z.string()
    .refine(
      val => Object.values(UserType).includes(val as UserType),
      {
        message: `Invalid user type. Valid options: ${Object.values(UserType).join(", ")}`
      }
    ),

  email: z
    .string({ message: "Email must be a string" })
    .min(1, "Email is required")  // Required validation
    .max(100)
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .trim()
    .toLowerCase(),


  password: z
    .string({ message: "Password must be a string" })
    .min(1, "Password is required")  // Required validation
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  address: z
    .string({ message: "Address must be string" })
    .min(5, "Please give us your complete address"),


  phone: z
    .string({ message: "Phone number must be a string" })
    .min(1, "Phone number is required")  // Required validation
    .trim()

    .regex(/^(?:\+?88|0088)?01[3-9]\d{8}$/, {
      message: "Must be a valid Bangladeshi phone number (01XXXXXXXXX format)"
    }),
    isBlocked:z
    .boolean({message:"isBlocked must be a boolen value"})
    .default(false)

});
import { z } from "zod";
import { UserType } from "../user/user.interface";

export const loginUserZodSchema = z.object({
  
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

 userType:z.enum(Object.values(UserType))
    
});
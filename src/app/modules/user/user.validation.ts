import { z } from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be a string" })
    .min(1, "Name is required")  // Required validation
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must not exceed 50 characters." })
    .trim(),

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

  phone: z
    .string({ message: "Phone number must be a string" })
    .min(1, "Phone number is required")  // Required validation
    .trim()
    .refine(
      (val) => /^(?:\+?88|0088)?01[3-9]\d{8}$/.test(val.replace(/\s+/g, '')),
      {
        message: "Must be a valid Bangladeshi phone number (01X-XXXX-XXXX format)"
      }
    )
    .transform(val => {
      // Standardize to +880 format
      const cleanVal = val.replace(/\s+/g, '');
      return cleanVal.startsWith('+880') ? cleanVal :
             cleanVal.startsWith('880') ? `+${cleanVal}` :
             cleanVal.startsWith('01') ? `+880${cleanVal}` : 
             cleanVal.replace(/^(0088|88)/, '+880');
    })
});
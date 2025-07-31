import { model, Schema } from "mongoose";
import { IUser, UserType } from "./user.interface";

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
        type: String,
        enum: Object.values(UserType),
        default: UserType.SENDER
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const User = model<IUser>("User", userSchema)
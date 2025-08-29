import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, UserType } from "./user.interface";
const authproviderSchema=new Schema<IAuthProvider>({
    provider:{type:String, required:true},
    providerId:{type:String,required:true}
},{
    versionKey:false,
    _id:false
})

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
        type: String,
        enum: Object.values(UserType),
        default: UserType.SENDER
    },
    auths:[authproviderSchema],
    phone: {
        type: String,
        required: true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isVarified:{
        type:Boolean,
        default:false
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const User = model<IUser>("User", userSchema)
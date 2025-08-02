import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";


const createUser = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.CONFLICT, "User already exist")
    }
    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const user = await User.create({
        ...payload,
        password: hashedPassword,
        isBlocked:false

    })
    return user
}


const getAllUsers = async () => {

    const users = await User.find({})
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}

const updateUser = async (userId: string, payload: Partial<IUser>) => {
    const users = await User.find({})
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}
const userBlockUpdate=async(email:string)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new AppError(httpStatus.BAD_REQUEST,"User not found")
    }
    user.isBlocked=!user.isBlocked
    user.save()
    return user
}



export const UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    userBlockUpdate
}
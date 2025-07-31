import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";


const createUser = async (payload: Partial<IUser>) => {
    console.log(payload)
    const { name, email, password, phone, address } = payload;
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist")
    }
    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address
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

const updateUser = async (userId:string, payload:Partial<IUser>) => {
    const users = await User.find({})
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}



export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.services";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserServices.createUser(req.body)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User created successfully",
            data: user
        })
    }
)
const getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const loginInfo = await UserServices.getAllUsers()
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.ACCEPTED,
            message: "All users retrieved successfully",
            data: loginInfo
        })
    }
)
const updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const payload = req.body;

        const user = await UserServices.updateUser(userId, payload)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.ACCEPTED,
            message: "User update successfully",
            data: user
        })
    }
)
const userBlockUpdate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.params;
        const user = await UserServices.userBlockUpdate(email)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.ACCEPTED,
            message: "Users block updated ",
            data: user
        })
    })

    const getMe=catchAsync(
        async(req:Request,res:Response,next:NextFunction)=>{ 
           
            const decodedToken=req.user as JwtPayload
            const result=await UserServices.getMe(decodedToken.userId)
            console.log("result---------------",result.data)
            sendResponse(res,{
                success:true,
                statusCode:httpStatus.OK,
                message:"Your profile retrieved successfully",
                data:result.data
            })

        }
    )


export const UserController = {
    createUser,
    getAllUsers,
    updateUser,
    userBlockUpdate,
    getMe
}
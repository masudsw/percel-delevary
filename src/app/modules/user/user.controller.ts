import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.services";
import { sendResponse } from "../../utils/sendResponse";


const createUser=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        console.log(req.body)
        const user=await UserServices.createUser(req.body)
        
        sendResponse(res,{
            success:true,
            statusCode:httpStatus.CREATED,
            message:"User created successfully",
            data:user
        })
    }
)
const getAllUsers=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        
        const user=await UserServices.getAllUsers()
        sendResponse(res,{
            success:true,
            statusCode:httpStatus.ACCEPTED,
            message:"All users retrieved successfully",
            data:user
        })
    }
)
const updateUser=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        const userId=req.params.id;
        const payload=req.body;
        
        const user=await UserServices.updateUser(userId,payload)
        sendResponse(res,{
            success:true,
            statusCode:httpStatus.ACCEPTED,
            message:"User update successfully",
            data:user
        })
    }
)
const userBlockUpdate=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        const {email}=req.params;
     const user=await UserServices.userBlockUpdate(email)
        sendResponse(res,{
            success:true,
            statusCode:httpStatus.ACCEPTED,
            message:"Users block updated ",
            data:user
        })
    })


export const UserController={
    createUser,
    getAllUsers,
    updateUser,
    userBlockUpdate
}
import { NextFunction, Request, Response } from "express";
import { ZodObject} from "zod";

export const valiateRequest=(ZodSchema:ZodObject)=>async(req:Request,res:Response,next:NextFunction)=>{
    try{
        req.body=await ZodSchema.parseAsync(req.body)

    }catch(error){
        next(error)
    }
}
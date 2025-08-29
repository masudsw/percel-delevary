import { NextFunction, Request, Response } from "express";
import { ZodObject} from "zod";

export const valiateRequest=(ZodSchema:ZodObject)=>async(req:Request,res:Response,next:NextFunction)=>{
    console.log("in side function valiate request")
    try{
        req.body=await ZodSchema.parseAsync(req.body)
        next()
        
    }catch(error){
        next(error)
    }
}
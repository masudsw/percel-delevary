/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from "zod";
import { IErrorSources, IGenericErrorResponse } from "../inerfaces/error.types";


export const handleZodError=(err:ZodError):IGenericErrorResponse=>{
    const errorSources:IErrorSources[]=[]
    err.issues.forEach((issue:any)=>{
        errorSources.push({
            path:issue.path[issue.path.length-1],
            message:issue.message
        })
    })
    console.log(errorSources)
    return{
        statusCode:400,
        message:"Zod validation error",
        errorSources
    }
}
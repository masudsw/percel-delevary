/* eslint-disable @typescript-eslint/no-unused-vars */
/*eslint-disable  @typescript-eslint/no-explicit-any */ 

import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleZodError } from "../helpers/handleZodError";
import { IErrorSources } from "../inerfaces/error.types";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error response structure
  let statusCode = 500;
  let message = "Something went wrong!!";
  let errorSources: IErrorSources[] = [];
  const stack = envVars.NODE_ENV === "development" ? err.stack : undefined;

  // Development logging
  if (envVars.NODE_ENV === "development") {
    console.error("ERROR:", err);
  }

  // Handle different error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } 
  else if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorSources[];
  }
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errorSources = Object.values(err.errors).map((val: any) => ({
      path: val.path,
      message: val.message,
    }));
  }
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    errorSources = [{
      path: field,
      message: `Duplicate value for ${field}`,
    }];
  }
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Final error response
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack, // Only in development
    ...(envVars.NODE_ENV === "production" && { stack: undefined }),
  });
};
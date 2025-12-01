import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/errors/ApiError.js";
import logger from "../utils/logger.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  if (err instanceof ApiError) {
    logger.error(
      {
        statusCode: err.statusCode,
        errorCode: err.errorCode,
        message: err.message,
        details: err.details,
        path: req.path,
        method: req.method,
        requestId: req.headers["x-request-id"],
      },
      `API Error: ${err.message}`,
    );
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errorCode: err.errorCode,
      details: err.details,
    });
  } else {
    logger.error(
      {
        path: req.path,
        method: req.method,
        requestId: req.headers["x-request-id"],
        error: err.message,
        stack: err.stack,
      },
      `Unhandled Internal Server Error: ${err.message}`,
    );
    res.status(500).json({
      statusCode: 500,
      message: "An unexpected error occurred.",
      errorCode: "UNEXPECTED_ERROR",
    });
  }
};

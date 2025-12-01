export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: any;

  constructor(
    statusCode: number,
    message: string,
    errorCode: string,
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found", details?: any) {
    super(404, message, "NOT_FOUND", details);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad request", details?: any) {
    super(400, message, "BAD_REQUEST", details);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Internal server error", details?: any) {
    super(500, message, "INTERNAL_SERVER_ERROR", details);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

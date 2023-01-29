import { ValidationError } from "class-validator";

export type ResponseStatus = "success" | "error";

/**
 * Success response
 */
export class Response<T> {
  public status: ResponseStatus = "success";
  public data: T;

  constructor(data: T) {
    this.data = data;
  }
}

/**
 * Error Response
 */
export class ErrorResponse {
  public status: ResponseStatus;
  public error: ErrorObj;

  constructor(error: any) {
    this.status = "error";
    // If class validation Error
    if (Array.isArray(error["errors"]) && error["errors"].every((element) => element instanceof ValidationError)) {
      let validationErrors: string[] = [];

      error["errors"].forEach((element: ValidationError) => {
        validationErrors.push(`${Object.values(element.constraints || {}).join(",")}`);
      });

      this.error = new ErrorObj("BAD_REQUEST", error["message"], validationErrors);
    } else {
      //Otherwise
      this.error = new ErrorObj(error["code"] || "BAD_REQUEST", error["message"]);
    }
  }
}

class ErrorObj {
  public code: string;
  public message: string;
  public errors?: any;

  constructor(code: string, message: string, errors: any = undefined) {
    this.code = code;
    this.message = message;
    this.errors = errors;
  }
}

import { BaseError, HttpStatusCode, ErrorCode } from "./base-error.error";

export class LogicalError extends BaseError {
  constructor(
    message: string,
    code: ErrorCode = "LOGICAL_ERROR",
    httpCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST
  ) {
    super(code, httpCode, message);
  }
}

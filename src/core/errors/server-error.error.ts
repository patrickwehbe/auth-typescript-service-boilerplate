import { BaseError, HttpStatusCode, ErrorCode } from "./base-error.error";

export class ServerError extends BaseError {
  constructor(
    message: string,
    code: ErrorCode = "SERVER_ERROR",
    httpCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(code, httpCode, message);
  }
}

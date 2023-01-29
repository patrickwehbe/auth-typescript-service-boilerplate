import { BaseError, HttpStatusCode, ErrorCode } from "./base-error.error";

export class InvalidUserHeaderError extends BaseError {
  constructor(
    message: string,
    code: ErrorCode = "INVALID_USER_HEADER",
    httpCode: HttpStatusCode = HttpStatusCode.UNAUTHORIZED
  ) {
    super(code, httpCode, message);
  }
}

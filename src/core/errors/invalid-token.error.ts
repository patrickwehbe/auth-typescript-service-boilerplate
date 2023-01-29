import { BaseError, HttpStatusCode, ErrorCode } from "./base-error.error";

export class InvalidTokenError extends BaseError {
  constructor(message: string, code: ErrorCode = "INVALID_TOKEN", httpCode: HttpStatusCode = HttpStatusCode.FORBIDDEN) {
    super(code, httpCode, message);
  }
}

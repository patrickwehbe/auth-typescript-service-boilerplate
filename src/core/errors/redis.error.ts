import { BaseError, ErrorCode, HttpStatusCode } from "./base-error.error";

export class RedisError extends BaseError {
  constructor(
    message: string,
    code: ErrorCode = "REDIS_ERROR",
    httpCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST
  ) {
    super(code, httpCode, message);
  }
}

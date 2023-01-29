import { BaseError, ErrorCode, HttpStatusCode } from "./base-error.error";

export class ArangoQueryError extends BaseError {
  constructor(
    message: string,
    code: ErrorCode = "ARANGO_QUERY_ERROR",
    httpCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST
  ) {
    super(code, httpCode, message);
  }
}

import { BaseError, ErrorCode, HttpStatusCode } from "./base-error.error";

export class ArangoTransactionError extends BaseError {
  constructor(
    message: string,
    code: ErrorCode = "ARANGO_TRANSACTION_ERROR",
    httpCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST
  ) {
    super(code, httpCode, message);
  }
}

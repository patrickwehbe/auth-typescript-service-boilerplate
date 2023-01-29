/**
 * Http status codes
 */
export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SUCCESS = 200
}

/**
 * Error code (e.g.: LOGICAL_ERROR)
 */
export type ErrorCode =
  | "ENV_VARIABLE_ERROR"
  | "ARANGO_QUERY_ERROR"
  | "ARANGO_TRANSACTION_ERROR"
  | "REDIS_ERROR"
  | "SERVER_ERROR"
  | "INVALID_TOKEN"
  | "INVALID_USER_HEADER"
  | "LOGICAL_ERROR"
  | "BAD_REQUEST"
  | "AWS_S3_ERROR"
  | "AMQP_ERROR"
  | "UNAUTHORIZED"
  | "FILE_STORAGE_ERROR";

/**
 * Parent Error class that should be inherited by all custom errprs.
 */
export class BaseError extends Error {
  /**
   * Error code of the custom exception (e.g: `INVALID_TOKEN`)
   */
  public readonly code: ErrorCode;
  /**
   * Http Code of the custom error (e.g. `404`)
   */
  public readonly httpCode: HttpStatusCode;

  constructor(code: ErrorCode, httpCode: HttpStatusCode, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}

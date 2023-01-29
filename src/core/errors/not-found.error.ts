import { BaseError, HttpStatusCode } from "./base-error.error";

export class NotFoundError extends BaseError {
	constructor(message: string) {
		super("LOGICAL_ERROR", HttpStatusCode.NOT_FOUND, message);
	}
}

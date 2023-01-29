import { BaseError, HttpStatusCode } from "./base-error.error";

export class BadRequestError extends BaseError {
	constructor(message: string) {
		super("BAD_REQUEST", HttpStatusCode.BAD_REQUEST, message);
	}
}
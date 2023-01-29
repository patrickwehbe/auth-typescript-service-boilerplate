import { BaseError, HttpStatusCode } from "./base-error.error";

export class UnauthorizedError extends BaseError {
	constructor(message: string) {
		super("UNAUTHORIZED", HttpStatusCode.UNAUTHORIZED, message);
	}
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import {
	ExpressErrorMiddlewareInterface,
	HttpError,
	Middleware,
} from "routing-controllers";
import { Service } from "typedi";
import { env } from "../../env";
import { ILogger } from "../interfaces/logger.interface";
import { Logger } from "../models";

@Middleware({ type: "after" })
@Service()
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
	public isProduction = env.isProduction;

	constructor(private log: ILogger) {
		this.log = new Logger(__filename);
	}

	public error(
		error: HttpError,
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		res.status(error.httpCode || 400);

		if (
			Array.isArray(error["errors"]) &&
			error["errors"].every((element) => element instanceof ValidationError)
		) {
			const validationErrors: string[] = [];

			error["errors"].forEach((element: ValidationError) => {
				validationErrors.push(
					`${Object.values(element.constraints || {}).join(",")}`
				);
			});

			res.json({
				name: error.name,
				message: error.message,
				errors: validationErrors,
			});
		} else {
			res.json({
				name: error.name,
				message: error.message,
				errors: error[`errors`] || [],
			});
		}

		if (this.isProduction || !this.isProduction) {
			this.log.error(error.name, error.message);
		} else {
			this.log.error(error.name, error.stack);
		}
	}
}

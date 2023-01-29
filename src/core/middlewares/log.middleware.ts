/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { env } from "../../env";
import { Logger } from "../../logger";

@Middleware({ type: "before" })
@Service()
export class LogMiddleware implements ExpressMiddlewareInterface {
	private log = new Logger(__dirname);

	public use(req: Request, res: Response, next: NextFunction) {
		return morgan(env.log.output, {
			stream: {
				write: this.log.info.bind(this.log),
			},
			skip: (_req, _res) => env.isTest,
		})(req, res, next);
	}
}

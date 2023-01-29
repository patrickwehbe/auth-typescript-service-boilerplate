import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Container, Service } from "typedi";
import { Context } from "../core/context";
import { Logger } from "../logger";

@Middleware({ type: "before" })
@Service()
export class LoggerMiddleware implements ExpressMiddlewareInterface {
	public context: any;
	private _logger: Logger;
	constructor() {
		this._logger = new Logger(__filename);
		this.context = Container.get(Context);
	}

	public use(req: Request, res: Response, next: NextFunction): any {
		this._logger.info(JSON.stringify(this.context));

		next();
	}
}

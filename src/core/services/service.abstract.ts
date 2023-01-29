import { ILogger } from "../../logger";
import { Logger } from "../models/logger.model";

/**
 * This is an abstract class that should be implemented by all services.
 *
 * There is the logger that can be used throughout all custom functions.
 */
abstract class Service {
	protected logger: ILogger;

	/**
	 * Used to initialize the logger
	 * @param logger (optional) we can pass the logger used in the main app. If not provided, a default logger will be used.
	 */
	constructor(logger?: ILogger) {
		if (logger) this.logger = logger;
		else this.logger = new Logger();
	}
}

export default Service;

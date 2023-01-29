import debug from "debug";
import { env } from "../../env";
import { banner } from "../../banner";
import { configLogger, Logger } from "../../logger";
import { registerServices } from "./container.config";
import { ExpressConfig } from "./express.config";
/**
 * Main application class
 * Creates the express server, launches it , and displays the banner.
 */
export class Application {
	server: any;
	express: ExpressConfig;

	constructor(dirname: string) {
		configLogger(env.log.level);
		const log = new Logger("App");
		log.info("Starting...");
		this.express = new ExpressConfig(dirname);

		const debugLog: debug.IDebugger = debug("app");
		const port = env.app.port;

		registerServices(log);

		// Start Webserver
		this.server = this.express.app.listen(port, () => {
			debugLog(`Server running at http://localhost:${port}`);
		});

		banner(log);
	}
}

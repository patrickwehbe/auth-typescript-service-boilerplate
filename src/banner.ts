import { env } from "./env";
import { Logger } from "./logger";

export function banner(log: Logger): void {
	if (env.app.banner) {
		const route = () => `${env.app.schema}://${env.app.host}:${env.app.port}`;
		log.info(``);
		log.info(`Your app is ready on ${route()}${env.app.routePrefix}`);
		log.info(`To shut it down, press <CTRL> + C at any time.`);
		log.info(``);
		log.info("-------------------------------------------------------");
		log.info(`Service      : ${env.app.name}`);
		log.info(`Version      : ${env.app.version}`);
		log.info(``);
		log.info(`API Info     : ${route()}${env.app.routePrefix}`);
		log.info("-------------------------------------------------------");
		log.info("");
		if (env.swagger.enabled) {
			log.info(`Swagger      : ${route()}${env.swagger.route}`);
			log.info("");
		}

		if (env.health.enabled) {
			log.info(`Health      : ${route()}${env.health.route}`);
			log.info("");
		}
	} else {
		log.info(`Application is up and running.`);
	}
}

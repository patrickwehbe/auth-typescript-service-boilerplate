import { Container } from "typedi";
import { env } from "../../env";
import { ILogger } from "../../logger/logger.interface";
import { ArangoService, RedisService } from "../services";

/**
 * Registers services in container
 * Used for dependency injection
 */
export const registerServices = (logger: ILogger) => {
	logger.info("Registering Arango Service");
	// Singleton Arango DB Connection
	Container.set(ArangoService, new ArangoService(env.database));

	logger.info("Registering Redis Service");
	Container.set(
		RedisService,
		new RedisService(env.redis.host, env.redis.port as any, "Common", logger)
	);
};

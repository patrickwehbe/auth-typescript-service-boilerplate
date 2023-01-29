import * as dotenv from "dotenv";
import * as path from "path";

import * as pkg from "../package.json";
import { getOsEnv, normalizePort, toBool, toNumber } from "./core/env";

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
	path: path.join(
		process.cwd(),
		`.env${process.env.NODE_ENV === "test" ? ".test" : ""}`
	),
});

/**
 * Environment variables
 */
export const env = {
	node: process.env.NODE_ENV || "development",
	isProduction: process.env.NODE_ENV === "production",
	isTest: process.env.NODE_ENV === "test",
	isDevelopment: process.env.NODE_ENV === "development",
	app: {
		name: getOsEnv("APP_NAME"),
		version: (pkg as any).version,
		description: (pkg as any).description,
		host: getOsEnv("APP_HOST"),
		schema: getOsEnv("APP_SCHEMA"),
		routePrefix: getOsEnv("APP_ROUTE_PREFIX"),
		port: normalizePort(getOsEnv("APP_PORT")),
		banner: toBool(getOsEnv("APP_BANNER")),
	},
	database: {
		username: getOsEnv("ARANGODB_USERNAME"),
		password: getOsEnv("ARANGODB_PASSWORD"),
		host: getOsEnv("ARANGODB_HOST"),
		port: normalizePort(getOsEnv("ARANGODB_PORT")),
		db: getOsEnv("ARANGODB_DB_NAME"),
		retries: toNumber(getOsEnv("ARANGO_MAX_RETRY_ATTEMPTS")),
		retryTimeout: toNumber(getOsEnv("ARANGO_RETRY_DELAY")),
		maxSockets: toNumber(getOsEnv("MAX_SOCKETS")),
	},
	redis: {
		host: getOsEnv("REDIS_HOST"),
		port: getOsEnv("REDIS_PORT"),
	},
	auth: {
		jwtSecret: getOsEnv("JWT_SECRET_KEY"),
		jwtExpireIn: toNumber(getOsEnv("JWT_TOKEN_EXPIRATION")),
		jwtRefreshIn: toNumber(getOsEnv("JWT_REFRESH_EXPIRATION")),
		hashSaltRounds: toNumber(getOsEnv("Hash_SALT_ROUNDS")),
	},
	org: {
		api_key: getOsEnv("ORG_API_KEY"),
	},
	cors: {
		allowOrigins: getOsEnv("CORS_ALLOW_ORIGINS_APP"),
		allowHeaders: getOsEnv("CORS_ALLOW_ORIGIN_HEADERS_APP"),
	},
	public: {
		url: getOsEnv("EMAIL_PUBLIC_URL"),
		verifyResetPasswordURLPath: getOsEnv("VERIFY_RESET_PASSWORD_URL_PATH"),
		verifyURLPath: getOsEnv("VERIFY_EMAIL_URL_PATH"),
	},
	log: {
		level: getOsEnv("LOG_LEVEL"),
		output: getOsEnv("LOG_OUTPUT"),
	},
	swagger: {
		enabled: toBool(getOsEnv("SWAGGER_ENABLED")),
		route: getOsEnv("SWAGGER_ROUTE"),
	},
	health: {
		enabled: toBool(getOsEnv("HEALTH_ENABLED")),
		route: getOsEnv("HEALTH_ROUTE"),
	},
};

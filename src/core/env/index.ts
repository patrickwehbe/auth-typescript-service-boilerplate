import { join } from "path";
function getOsEnv(key: string): string {
	if (typeof process.env[key] === "undefined") {
		throw new Error(`Environment variable ${key} is not set.`);
	}

	return process.env[key] as string;
}
function getOsEnvOptional(key: string): string | undefined {
	return process.env[key];
}
function getPath(path: string): string {
	return process.env.NODE_ENV === "production"
		? join(process.cwd(), path.replace("src/", "dist/").slice(0, -3) + ".js")
		: join(process.cwd(), path);
}
function getPaths(paths: string[]): string[] {
	return paths.map((p) => getPath(p));
}
function getOsPath(key: string): string {
	return getPath(getOsEnv(key));
}
function getOsPaths(key: string): string[] {
	return getPaths(getOsEnvArray(key));
}
function getOsEnvArray(key: string, delimiter = ","): string[] {
	return process.env[key]?.split(delimiter) || [];
}
function toNumber(value: string): number {
	return parseInt(value, 10);
}
function toBool(value: string): boolean {
	return value === "true";
}

function normalizePort(port: string): number | string | boolean {
	const parsedPort = parseInt(port, 10);
	if (isNaN(parsedPort)) {
		// named pipe
		return port;
	}
	if (parsedPort >= 0) {
		// port number
		return parsedPort;
	}
	return false;
}

export {
	getOsEnv,
	getOsEnvOptional,
	getOsPath,
	getOsPaths,
	getOsEnvArray,
	toNumber,
	toBool,
	normalizePort,
};

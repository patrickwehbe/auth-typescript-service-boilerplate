import * as path from "path";
import * as winston from "winston";
import { ILogger } from "../interfaces/logger.interface";

export class Logger implements ILogger {
	public static DEFAULT_SCOPE = "app";

	private _scope: string;
	private _requestId?: string;

	private static parsePathToScope(filepath: string): string {
		if (filepath.indexOf(path.sep) >= 0) {
			filepath = filepath.replace(process.cwd(), "");
			filepath = filepath.replace(`${path.sep}src${path.sep}`, "");
			filepath = filepath.replace(`${path.sep}dist${path.sep}`, "");
			filepath = filepath.replace(".ts", "");
			filepath = filepath.replace(".js", "");
			filepath = filepath.replace(path.sep, ":");
		}
		return filepath;
	}

	constructor(scope?: string, requestId?: string) {
		this._scope = Logger.parsePathToScope(scope ? scope : Logger.DEFAULT_SCOPE);
		this._requestId = requestId;
	}

	public debug(message: string, ...args: any[]): void {
		this.log("debug", message, args);
	}

	public info(message: string, ...args: any[]): void {
		this.log("info", message, args);
	}

	public warn(message: string, ...args: any[]): void {
		this.log("warn", message, args);
	}

	public error(message: string, ...args: any[]): void {
		this.log("error", message, args);
	}

	public setRequestId(requestId: string) {
		this._requestId = requestId;
	}

	public setScope(scope: string) {
		this._scope = Logger.parsePathToScope(scope);
	}

	private log(level: string, message: string, args: any[]): void {
		winston.log(level, `${this.formatHeader()} ${message}`, args);
	}

	private formatHeader(): string {
		let header = `${this._scope}`;

		if (this._requestId) {
			header += ` -- Request Id ${this._requestId}:`;
		}
		return header;
	}
}

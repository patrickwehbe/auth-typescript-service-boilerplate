/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILogger {
	/**
	 *
	 *
	 * @param {string} message
	 * @param {...any[]} args
	 * @memberof ILogger
	 */
	debug(message: string, ...args: any[]): void;

	/**
	 *
	 *
	 * @param {string} message
	 * @param {...any[]} args
	 * @memberof ILogger
	 */
	info(message: string, ...args: any[]): void;

	/**
	 *
	 *
	 * @param {string} message
	 * @param {...any[]} args
	 * @memberof ILogger
	 */
	warn(message: string, ...args: any[]): void;

	/**
	 *
	 *
	 * @param {string} message
	 * @param {...any[]} args
	 * @memberof ILogger
	 */
	error(message: string, ...args: any[]): void;
}

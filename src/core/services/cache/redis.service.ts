import { ClientOpts, RetryStrategyOptions } from "redis";
import { RedisError } from "../../errors/redis.error";
import {
	IAsyncRedis,
	ILogger,
	IRedisService,
	Microservice,
	RedisConnections,
	RedisDbNumbers,
} from "../../interfaces";
import Wrapper from "../wrapper.abstract";
import { AsyncRedis } from "./async-redis";

const DB_INDEXES: RedisDbNumbers = {
	Common: 0,
	Auth: 1,
	Monitor: 2,
};
export class RedisService extends Wrapper<IAsyncRedis> implements IRedisService {
	private static connections: RedisConnections = {};
	protected instance: IAsyncRedis;
	private _retries = 5;
	private _retryTimeout = 500;
	private _db: number;

	/**
	 * Since Redis is single threaded and uses pipelining (queuing of incoming queries), it is advised to have a single connection per microservice.
	 *
	 * Therefore, this controller has a static pool of `redis` connections which are lazily created.
	 * This pool is indexed by the redis database number.
	 *
	 * The flow goes as follows:
	 *  - New call of `constructor` with db index of `0`.
	 *  - `RedisController` checks if a connection already exists in the pool by searching for the index `0`.
	 *  - If the connection exists, then simply bind it `RedisController`'s instance, otherwise, lazily create it and append it to the static pool.
	 * @param host Redis host
	 * @param port Redis port
	 * @param db Default redis db number
	 * @param options Extra optional options
	 */
	constructor(
		host: string,
		port: number,
		db: Microservice,
		logger?: ILogger,
		options?: ClientOpts
	) {
		super(logger);
		if (!RedisService.connections[DB_INDEXES[db]]) {
			RedisService.connections[DB_INDEXES[db]] = new AsyncRedis({
				host,
				port,
				db: DB_INDEXES[db],
				retry_strategy: (options: RetryStrategyOptions) => {
					if (options.error) {
						this.logger.error(
							`Attempt ${options.attempt}/${this._retries} Error while connecting to the redis server. Error details: `,
							options.error
						);
					}
					if (options.attempt >= this._retries) {
						this.logger.error(
							`Exceeded the maximum number of attempts (${this._retries}). Exiting...`
						);
						throw new RedisError(`Redis Server Error. Please check admin.`);
					}
					return this._retryTimeout;
				},
				...options,
			});
		}
		this.instance = RedisService.connections[DB_INDEXES[db]];
		this._db = DB_INDEXES[db];
	}

	async getAsync<T>(owner: string, key: string): Promise<T> {
		const finalKey = this.constructKey(owner, key) as string;
		try {
			const val: any = await this.instance.getAsync(finalKey);
			return JSON.parse(val) as T;
		} catch (err: any) {
			this.logger.error(`Error getting value from redis with key ${finalKey}`);
			throw new RedisError(err.message);
		}
	}

	async setAsync<T>(owner: string, key: string, val: T): Promise<void> {
		const finalKey = this.constructKey(owner, key) as string;
		try {
			await this.instance.setAsync(finalKey, JSON.stringify(val));
		} catch (err: any) {
			this.logger.error(`Error setting value in redis with key ${finalKey}`);
			throw new RedisError(err.message);
		}
	}

	async deleteAsync(owner: string, key: string | string[]): Promise<void> {
		let finalKey = this.constructKey(owner, key);
		try {
			await this.instance.delAsync(finalKey);
		} catch (err: any) {
			this.logger.error(`Error deleting value from redis with key ${finalKey}`);
			throw new RedisError(err.message);
		}
	}

	async selectDbAsync(microservice: Microservice): Promise<void> {
		try {
			await this.instance.selectDbAsync(DB_INDEXES[microservice]);
		} catch (err: any) {
			this.logger.error(`Error switching to redis db: ${microservice}`);
			throw new RedisError(err.message);
		}
	}

	private constructKey(owner: string, key: string | string[]): string | string[] {
		if (Array.isArray(key)) return key.map((x) => `${owner}:${x}`);
		else return `${owner}:${key}`;
	}
}

import { RedisClient } from "redis";
import { Microservice } from "./global.interface";

/**
 * Definition of `AsyncRedis` which is a wrapper for promisified function of redis
 */
export interface IAsyncRedis extends RedisClient {
	getAsync: (arg1: string) => Promise<string | null>;
	setAsync: (arg1: string, arg2: string) => Promise<"OK">;
	delAsync: (arg1: string | string[]) => Promise<number>;
	quitAsync: () => Promise<"OK">;
	flushDbAsync: () => Promise<"OK">;
	selectDbAsync: (dbIndex: number) => Promise<"OK">;
}

export interface IRedisService {
	/**
	 * Get a value T from redis
	 * @param owner the identifier of the user asking for the record: it can be system, or userId or organizationId or a combination
	 * @param key key of the value stored.
	 */
	getAsync<T>(owner: string, key: string): Promise<T | null>;

	/**
	 * Sets a value in the cache
	 * @param owner the owner of that resource
	 * @param key the key used to store the value in redis
	 * @param val the value
	 */
	setAsync<T>(owner: string, key: string, val: T): Promise<void>;

	/**
	 * Deletes a value from the cache
	 * @param owner the owner of that resource
	 * @param key by key
	 */
	deleteAsync(owner: string, key: string | string[]): Promise<void>;

	/**
	 * Switches to a specific db in redis (every microservice has its own db)
	 * @param microservice redis db number
	 */
	selectDbAsync(microservice: Microservice): Promise<void>;
}

export type RedisConnections = { [key: number]: IAsyncRedis };

export type RedisDbNumbers = { [key in Microservice]: number };

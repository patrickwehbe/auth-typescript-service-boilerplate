import { RedisClient } from "redis";
import { promisify } from "util";
import { IAsyncRedis } from "../../interfaces";

/**
 * This class extends the base `RedisClient` but with extended **async await** behaviour.
 */
export class AsyncRedis extends RedisClient implements IAsyncRedis {
	public readonly getAsync: (arg1: string) => Promise<string | null> = promisify(
		this.get
	).bind(this);
	public readonly setAsync: (arg1: string, arg2: string) => Promise<"OK"> = promisify(
		this.set
	).bind(this) as any;
	public readonly delAsync: (arg1: string | string[]) => Promise<number> = promisify(
		this.del
	).bind(this);
	public readonly quitAsync: () => Promise<"OK"> = promisify(this.quit).bind(this);
	public readonly flushDbAsync: () => Promise<"OK"> = promisify(this.flushdb).bind(
		this
	) as any;
	public readonly selectDbAsync: (dbIndex: number) => Promise<"OK"> = promisify(
		this.set
	).bind(this) as any;
}

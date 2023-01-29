import mongodb, { Collection, Db, MongoClient } from "mongodb";
import retry from "async-retry";
import { ILogger } from "../../../../interfaces";
import Wrapper from "../../../../wrapper.abstract";
import { IDatabaseConnection } from "../interfaces/database.interface";

export class MongoConnection extends Wrapper<Db> implements IDatabaseConnection {
	protected instance: Db;
	private _retries: number;
	private _retryTimeout: number;
	private _client: MongoClient;

	/**

Wraps the mongo connection with helper functions suchs as .query() and .transaction()
@param client MongoClient instance
@param logger logger used in the main app (optional)
@param retries Number of retries in case of connection failure
@param retryTimeout Time before trying to connect again
*/
	constructor(
		client: MongoClient,
		retries: number,
		retryTimeout: number,
		logger?: ILogger
	) {
		super(logger);
		this._client = client;
		this._retries = retries;
		this._retryTimeout = retryTimeout;
	}
	insert<T>(collectionName: string, obj: T): Promise<Object> {
		throw new Error("Method not implemented.");
	}
	bulkInsert<T>(collectionName: string, objList: T[]): Promise<Object[]> {
		throw new Error("Method not implemented.");
	}
	async query<T>(collectionName: string, query: object): Promise<T[]> {
		try {
			const result = await retry(
				async (_: any, attempt: any) => {
					this.logger.info(`Executing the query. Attempt ${attempt}`);
					const collection: Collection = this._client
						.db()
						.collection(collectionName);
					const results = await collection.find(query).toArray();
					return results;
				},
				{
					retries: this._retries,
					maxTimeout: this._retryTimeout,
					minTimeout: this._retryTimeout,
					onRetry: (e: { message: any }, attempt: any) => {
						this.logger.error(
							`MongoDB server error found on attempt number ${attempt}. Error details: , e.message`
						);
					},
				}
			);
			this.logger.info(`Successfully executed the query. Returning the result.`);
			return [...result] as any;
		} catch (error: any) {
			this.logger.error(`MongoDB error found. Error details: , error.message`);
			throw new Error(error.message);
		}
	}

	async transaction<T>(
		collectionName: string,
		action: (session: any) => Promise<T>
	): Promise<T> {
		try {
			this.logger.info(`Executing the transaction`);
			const session = await this._client.startSession();
			session.startTransaction();
			const collection: Collection = this._client.db().collection(collectionName);
			const result = await action(collection);

			await session.commitTransaction();
			session.endSession();
			this.logger.info(`Successfully executed the transaction.`);
			return result;
		} catch (error: any) {
			this.logger.error(`MongoDB error found. Error details: `, error.message);
			throw new Error(error.message);
		}
	}
}

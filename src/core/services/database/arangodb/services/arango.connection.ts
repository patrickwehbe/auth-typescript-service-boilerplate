import { ArrayCursor } from "arangojs/cursor";
import {
	Database,
	QueryOptions,
	TransactionCollections,
	TransactionOptions,
} from "arangojs/database";
import retry from "async-retry";
import {
	ArangoQueryError,
	ArangoTransactionError,
	ServerError,
} from "../../../../errors";
import { ILogger } from "../../../../interfaces";
import { IDatabaseConnection } from "../interfaces/database.interface";
import Wrapper from "../../../wrapper.abstract";

export class ArangoConnection extends Wrapper<Database> implements IDatabaseConnection {
	protected instance: Database;

	private _retries: number;
	private _retryTimeout: number;

	/**
	 * Wraps the arango connection with helper functions suchs as `.query()` and `.transaction()`
	 * @param db Arango database
	 * @param logger logger used in the main app (optional)
	 * @param retries Number of retries in case of connection failure
	 * @param retryTimeout Time before trying to connect again
	 * @param logger logger used in the main app (optional)
	 */
	constructor(db: Database, retries: number, retryTimeout: number, logger?: ILogger) {
		super(logger);
		this.instance = db;

		this._retries = retries;
		this._retryTimeout = retryTimeout;
	}

	async query<T, P>(query: string, params?: P, options?: QueryOptions): Promise<T[]> {
		try {
			const result = await retry(
				async (_: any, attempt: any) => {
					this.logger.info(`Executing the query. Attempt ${attempt}`);
					const cursor: ArrayCursor<T> = await this.instance.query(
						query,
						{ ...params },
						{ ...options }
					);
					const results = await cursor.all();
					return results;
				},
				{
					retries: this._retries,
					maxTimeout: this._retryTimeout,
					minTimeout: this._retryTimeout,
					onRetry: (e: { message: any }, attempt: any) => {
						this.logger.error(
							`Arango server error found on attempt number ${attempt}. Error details: `,
							e.message
						);
					},
				}
			);
			this.logger.info(`Successfully executed the query. Returning the result`);

			return [...result];
		} catch (error: any) {
			if (error.isArangoError) {
				this.logger.error(
					`Arango logical error found. Error details: `,
					error.message
				);
				throw new ArangoQueryError(error.message);
			} else {
				this.logger.error(`Server error found. Error details: `, error.message);
				throw new ServerError(error.message);
			}
		}
	}

	async transaction<T, P>(
		collections: TransactionCollections,
		action: (params?: P) => any,
		params?: P,
		options?: TransactionOptions
	): Promise<T> {
		try {
			const stringifiedAction = String(action);
			this.logger.info(`Executing the transaction.`);
			const result: T = await this.instance.executeTransaction(
				collections,
				stringifiedAction,
				{
					...options,
					params,
				}
			);
			this.logger.info(`Successfully executed the transaction.`);
			return result;
		} catch (error: any) {
			if (error.isArangoError) {
				this.logger.error(
					`Arango logical error found. Error details: `,
					error.message
				);
				throw new ArangoTransactionError(error.message);
			} else {
				this.logger.error(`Server error found. Error details: `, error.message);
				throw new ServerError(error.message);
			}
		}
	}

	async bulkInsert<T>(collectionName: string, objList: T[]): Promise<T[]> {
		const insertQuery = `
        FOR obj IN @objList
          INSERT obj INTO @@collectionName
          RETURN NEW
    `;

		const insertParams = {
			objList: objList,
			"@collectionName": collectionName,
		};

		return await this.query<T, any>(insertQuery, insertParams);
	}
}

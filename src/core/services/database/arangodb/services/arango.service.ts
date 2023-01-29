import { Database } from "arangojs";
import { CreateCollectionOptions } from "arangojs/collection";
import {
	IArangoFilter,
	IArangoOptions,
	IDatabaseService,
	SortDirection,
} from "../interfaces/database.interface";
import { ILogger } from "../../../../interfaces";
import { ArangoConnection } from "./arango.connection";

export class ArangoService implements IDatabaseService {
	private _retries: number;
	private _retryTimeout: number;

	private _connection: Database;
	constructor(arangoOptions: IArangoOptions) {
		this._connection = new Database({
			url: `http://${arangoOptions.host}:${arangoOptions.port}/`,
			auth: { username: arangoOptions.username, password: arangoOptions.password },
			databaseName: arangoOptions.db,
			agentOptions: {
				maxSockets: arangoOptions.maxSockets,
			},
		});
		this._retries = arangoOptions.retries;
		this._retryTimeout = arangoOptions.retryTimeout;
	}

	public getConnection(logger?: ILogger): ArangoConnection {
		return new ArangoConnection(
			this._connection,
			this._retries,
			this._retryTimeout,
			logger
		);
	}

	public constructFilters(prefix: string, filters: IArangoFilter[]): string {
		const query = `${filters.reduce(
			(prev, curr) =>
				`${prev}${prefix}.${curr.type} ${curr.isArray ? "IN" : "=="} ${
					curr.value
				} AND `,
			""
		)}${prefix}.isActive == true`;
		return query;
	}

	public async createDatabase(db: string): Promise<boolean> {
		const doesExist = await this._connection.database(db).exists();
		if (!doesExist) {
			await this._connection.createDatabase(db);
		}
		return true;
	}

	public async createCollection(
		name: string,
		deletePrevious?: boolean,
		options?: CreateCollectionOptions
	): Promise<boolean> {
		const doesExist = await this._connection.collection(name).exists();
		if (!doesExist) {
			await this._connection.createCollection(name, options);
		} else {
			if (deletePrevious) {
				await this._connection.collection(name).drop();
				await this._connection.createCollection(name, options);
			}
		}
		return true;
	}

	public async createEdge(
		name: string,
		deletePrevious?: boolean,
		options?: CreateCollectionOptions
	): Promise<boolean> {
		const doesExist = await this._connection.collection(name).exists();
		if (!doesExist) {
			await this._connection.createEdgeCollection(name, options);
		} else {
			if (deletePrevious) {
				await this._connection.collection(name).drop();
				await this._connection.createEdgeCollection(name, options);
			}
		}
		return true;
	}

	/**
	 *
	 * @param {number} itemsPerPage
	 * @param {number} pageNumber
	 * @returns {string}
	 */
	public constructLimit(itemsPerPage: number, pageNumber: number): string {
		let query = "";
		if (itemsPerPage >= 0 && pageNumber >= 0) {
			const startId = pageNumber * itemsPerPage;
			query = `LIMIT ${startId}, ${itemsPerPage} `;
		}
		return query;
	}

	/**
	 *
	 * @param {SortDirection} sortOrder  ASC/DESC
	 * @param {string} sortBy name of the field
	 * @param {string} prefix letter or word that will prefix
	 * @returns {string} sort query
	 */
	public constructSort(
		sortOrder: SortDirection,
		sortBy: string,
		prefix: string
	): string {
		let query = "";
		if (sortOrder && sortBy) {
			query = `SORT ${prefix}.${sortBy} ${sortOrder}`;
		}
		return query;
	}
}

import { CreateCollectionOptions } from "arangojs/collection";
import {
	QueryOptions,
	TransactionCollections,
	TransactionOptions,
} from "arangojs/database";
import { ILogger } from "../../../../interfaces";
export interface IDatabaseFilter {
	type: string;
	value: any;
}

export interface IArangoFilter extends IDatabaseFilter {
	isArray?: boolean;
}

export interface ICollection {
	name: string;
	isEdge?: boolean;
}

export interface IArangoOptions {
	username: string;
	password: string;
	host: string;
	port: number | string | boolean;
	db: string;
	maxSockets: number;
	retries: number;
	retryTimeout: number;
}

export interface IPaginationMetaData {
	itemsPerPage: number;
	totalItems: number;
	totalPages: number;
}

export type SortDirection = "ASC" | "DESC";
export interface IDatabaseService {
	/**
	 * Creates a new wrapper of the connection to the specified database then returns it
	 * @param logger logger used in the main app (optional)
	 */
	getConnection(logger?: ILogger): IDatabaseConnection;

	/**
	 * Generic function that constructs database filters based on implementation class
	 * @param prefix letter or word that will prefix the filters (e.g: **user** is the prefix is **user.name**)
	 * @param filters array of filters to filter by, such as id value or name value
	 */
	constructFilters(prefix: string, filters: IDatabaseFilter[]): string;

	/**
	 * Creates a new database with the given db name
	 * @param db Database name that will be created
	 */
	createDatabase(db: string): Promise<boolean>;

	/**
	 * Creates a new collection inside the database
	 * @param name Collection name that will be created
	 * @param deletePrevious If set to true, then deletes any existing collection that has the same name, otherwise this function safely succeeds
	 * @param options optional collection options
	 */
	createCollection(
		name: string,
		deletePrevious?: boolean,
		options?: CreateCollectionOptions
	): Promise<boolean>;

	/**
	 * Creates a new edge collection inside the database
	 * @param name Edge collection name that will be created
	 * @param deletePrevious If set to true, then deletes any existing edge that has the same name, otherwise this function safely succeeds
	 * @param options optional edge options
	 */
	createEdge(
		name: string,
		deletePrevious?: boolean,
		options?: CreateCollectionOptions
	): Promise<boolean>;

	/**
	 * Function that construct sorting query based on implementation class
	 * @param {SortDirection} sortOrder  ASC/DESC
	 * @param {string} sortBy name of the field
	 * @param {string} prefix letter or word that will prefix
	 * @returns {string} sort query
	 */
	constructSort(sortOrder: SortDirection, sortBy: string, prefix: string): string;

	/**
	 * Function that construct pagination query based on implementation class
	 * @param {number} itemsPerPage
	 * @param {number} pageNumber
	 * @returns {string} pagination query
	 */
	constructLimit(itemsPerPage: number, pageNumber: number): string;
}

export interface IDatabaseConnection {
	/**
	 * Queries the database with the given inputs
	 * @param query The query that will be ran on the database
	 * @param params If the query contains params, then this object should be filled
	 * @param options additional options to add to the query
	 */
	query<T, P>(query: string, params?: P, options?: QueryOptions): Promise<T[]>;

	/**
	 * Creates and executes a server side transaction with the given inputs
	 * @param collections The write/read/exclusive collections which will be reserved by the transaction
	 * @param action The transaction action that will be ran on the database
	 * @param params If the action contains params, then this object should be filled
	 * @param options additional options to add to the transaction
	 */
	transaction<T, P>(
		collections: TransactionCollections,
		action: (params?: P) => any,
		params?: P,
		options?: TransactionOptions
	): Promise<T>;

	/**
	 * Inserts multiple records to a collection
	 * @param collectionName collection name where the records should be inserted
	 * @param objList list of objects of type T that need to be inserted
	 */
	bulkInsert<T>(collectionName: string, objList: T[]);
}

import { Collection, Db } from "mongodb";

export interface IDatabaseFilter {
	type: string;
	value: any;
}

export interface IMongoFilter extends IDatabaseFilter {
	isArray?: boolean;
}

export interface ICollection {
	name: string;
}

export interface IMongoOptions {
	url: string;
	dbName: string;
}

export interface IPaginationMetaData {
	itemsPerPage: number;
	totalItems: number;
	totalPages: number;
}

export type SortDirection = "asc" | "desc";

export interface IDatabaseService {
	/**

Creates a new wrapper of the connection to the specified database then returns it
*/
	getConnection(): Promise<IDatabaseConnection>;
	/**

Generic function that constructs database filters based on implementation class
@param prefix letter or word that will prefix the filters (e.g: user is the prefix is user.name)
@param filters array of filters to filter by, such as id value or name value
*/
	constructFilters(prefix: string, filters: IDatabaseFilter[]): Object;
	/**

Creates a new database with the given db name
@param db Database name that will be created
*/
	createDatabase(db: string): Promise<void>;
	/**

Creates a new collection inside the database
@param name Collection name that will be created
*/
	createCollection(name: string): Promise<Collection<any>>;
	/**

Function that construct sorting query based on implementation class
@param {SortDirection} sortOrder ASC/DESC
@param {string} sortBy name of the field
@param {string} prefix letter or word that will prefix
@returns {Object} sort query
*/
	constructSort(sortOrder: SortDirection, sortBy: string, prefix: string): Object;
	/**

Function that construct pagination query based on implementation class
@param {number} itemsPerPage
@param {number} pageNumber
@returns {Object} pagination query
*/
	constructLimit(itemsPerPage: number, pageNumber: number): Object;
}
export interface IDatabaseConnection {
	/**

Queries the collection with the given inputs
@param collectionName The collection that will be queried
@param query The query that will be ran on the collection
@param options additional options to add to the query
*/
	query<T>(collectionName: string, query: Object, options?: Object): Promise<T[]>;
	/**

Inserts a record to a collection
@param collectionName collection name where the record should be inserted
@param obj object of type T that needs to be inserted
*/
	insert<T>(collectionName: string, obj: T): Promise<Object>;
	/**

Inserts multiple records to a collection
@param collectionName collection name where the records should be inserted
@param objList list of objects of type T that need to be inserted
*/
	bulkInsert<T>(collectionName: string, objList: T[]): Promise<Object[]>;
}

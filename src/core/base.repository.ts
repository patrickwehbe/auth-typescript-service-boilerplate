import { ArangoConnection, ArangoService } from "./services/database/arangodb/services";
import { BaseService } from "./base.service";

/**
 * Base repository class.
 * Exposes to the data access layer: the context, logger, and database.
 */
export abstract class BaseRepository extends BaseService {
	protected _database: ArangoConnection;
	protected _arangoService: ArangoService;

	constructor(filename: string, arangoService: ArangoService) {
		super(filename);
		this._database = arangoService.getConnection(this._logger);
		this._arangoService = arangoService;
	}
}

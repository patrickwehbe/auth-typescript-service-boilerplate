import { Service } from "typedi";
import { MonitorGetQuery } from "../controllers/request";
import { BaseRepository } from "../core/base.repository";
import { ArangoService } from "../core/services/database/arangodb/services/arango.service";
import { Monitor, User } from "../models";

@Service()
export class MonitorRepository extends BaseRepository {
	constructor(arangoService: ArangoService) {
		super(__filename, arangoService);
	}

	async createMonitor(monitor: Monitor): Promise<void> {
		const query = `
				INSERT @monitor INTO monitor
			    OPTIONS {keepNull: false}
				RETURN NEW
				`;

		monitor.createdAt = +new Date();
		monitor.isActive = true;

		const params = {
			monitor,
		};
		await this._database.query<User, any>(query, params);
	}

	async getMonitor(queryParams: MonitorGetQuery): Promise<Monitor[]> {
		const query = `
				FOR m in monitor
				FILTER m.isActive == true
                ${
					queryParams.organizationId
						? `AND m.organizationId== '${queryParams.organizationId}'`
						: ""
				}
                ${
					queryParams.objectIds
						? `AND m.objectId IN [${queryParams.objectIds
								.split(",")
								.map((s) => `'${s}'`)
								.join(",")}]`
						: ""
				}
				${
					queryParams.objectNames
						? `AND m.objectName IN [${queryParams.objectNames
								.split(",")
								.map((s) => `'${s}'`)
								.join(",")}]`
						: ""
				}
				${
					queryParams.userIds
						? `AND m.userId IN [${queryParams.userIds
								.split(",")
								.map((s) => `'${s}'`)
								.join(",")}]`
						: ""
				}
                SORT m.createdAt ASC
				RETURN m`;

		return this._database.query<Monitor, any>(query);
	}
}

import { Service } from "typedi";
import { BaseService } from "../core/base.service";
// import { MonitorRepository } from "../repositories";
import { Monitor } from "../models";

@Service()
export class MonitorService extends BaseService {
	constructor(private _monitorRepo: any) {
		super(__filename);
	}

	async saveMonitor(monitor: Monitor): Promise<void> {
		this._logger.info(`Saving monitor...`);
		// await this._monitorRepo.createMonitor(monitor);
		this._logger.info(`Successfully monitored request`);
	}
}

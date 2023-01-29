import { BadRequestError } from "../../core/errors/bad-request.error";
import { Monitor } from "../../models";

export class MonitorResponse {
	id: string;

	organizationId: string;

	userId?: string;

	requestType: string;

	requestId: string;

	requestURL: string;

	objectId?: string;

	objectName: string;

	body: any;

	public static getMonitorResponse(monitor: Monitor): MonitorResponse {
		if (!monitor._key)
			throw new BadRequestError("Something wrong with the monitor's key");

		return {
			id: monitor._key,
			userId: monitor.userId,
			organizationId: monitor.organizationId,
			requestType: monitor.requestType,
			requestId: monitor.requestId,
			requestURL: monitor.requestURL,
			objectId: monitor.objectId,
			objectName: monitor.objectName,
			body: monitor.body,
		};
	}

	public static getMonitorResponseList(monitors: Monitor[]): MonitorResponse[] {
		let monitorResponseList: MonitorResponse[] = [];

		for (const monitor of monitors) {
			monitorResponseList.push(MonitorResponse.getMonitorResponse(monitor));
		}

		return monitorResponseList;
	}
}

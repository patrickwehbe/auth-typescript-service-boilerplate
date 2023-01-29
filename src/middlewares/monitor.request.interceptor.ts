import { Action, InterceptorInterface } from "routing-controllers";
import Container, { Service } from "typedi";
import { Context } from "../core/context";
import { MonitorService } from "../services";

@Service()
export class MonitorRequestInterceptor implements InterceptorInterface {
	private _monitorService: MonitorService;

	constructor() {
		this._monitorService = Container.get(MonitorService);
	}

	intercept(action: Action, content: any) {
		if (
			(action.request.method === "POST" ||
				action.request.method === "PUT" ||
				action.request.method === "DELETE") &&
			content.status === "success"
		) {
			const { request } = action;
			const splitUrls = request.url.split("/");

			const objectName =
				action.request.method === "POST"
					? splitUrls.pop()
					: splitUrls[splitUrls.length - 2];
			this._monitorService.saveMonitor({
				organizationId: Context.getOrgId() ? Context.getOrgId() : "",
				userId: Context.getCurrentUser() && Context.getCurrentUser().id,
				requestType: request.method,
				requestId: Context.getRequestId(),
				requestURL: request.url,
				objectId: content.data.id,
				objectName,
				body: request.body,
			});
		}
		return content;
	}
}

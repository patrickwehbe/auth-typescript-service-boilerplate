import { Model } from "../core/models/arango.model";

export class Monitor extends Model {
	organizationId: string;

	userId?: string;

	requestType: string;

	requestId: string;

	requestURL: string;

	objectId?: string;

	objectName: string;

	body: any;
}

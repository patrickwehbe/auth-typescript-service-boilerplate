import { Request, Response } from "express";
import * as httpContext from "express-http-context";
import { Service } from "typedi";
import { User } from "../models/user.model";

enum CONTEXT_VALUES {
	REQUEST_ID = "request-id",
	ORG_ID = "org-id",
	CURRENT_USER = "current-user",
}

/**
 * Context is a class used to save the main parameters used throughout a request (requestId, logged in user, logger, etc.)
 */
@Service()
export class Context {
	constructor() {}

	setContext(req: Request, res: Response, requestId: string): void {
		httpContext.ns.bindEmitter(req);
		httpContext.ns.bindEmitter(res);
		httpContext.set(CONTEXT_VALUES.REQUEST_ID, requestId);
	}

	/**
	 *
	 * @static
	 * @returns requestId which is present in http context
	 * @memberof Context
	 */
	public static getRequestId(): string {
		return httpContext.get(CONTEXT_VALUES.REQUEST_ID);
	}

	/**
	 * Sets org Id in the context
	 * @static
	 * @memberof Context
	 */
	public static setOrgId(orgId: string): void {
		httpContext.set(CONTEXT_VALUES.ORG_ID, orgId);
	}

	/**
	 *
	 * @static
	 * @returns orgId which is present in http context
	 * @memberof Context
	 */
	public static getOrgId(): string {
		return httpContext.get(CONTEXT_VALUES.ORG_ID);
	}

	/**
	 * Sets current user in the context
	 * @static
	 * @memberof Context
	 */
	public static setCurrentUser(currentUser: User): void {
		httpContext.set(CONTEXT_VALUES.CURRENT_USER, currentUser);
	}

	/**
	 *
	 * @static
	 * @returns current User which is present in http context
	 * @memberof Context
	 */
	public static getCurrentUser(): User {
		return httpContext.get(CONTEXT_VALUES.CURRENT_USER);
	}
}

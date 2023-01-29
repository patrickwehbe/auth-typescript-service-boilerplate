import { Action } from "routing-controllers";
import { Container } from "typedi";
import { AuthService } from "../services";
import { Context } from "../core/context";

export async function authorizationChecker(
	action: Action,
	roles: string[]
): Promise<boolean> {
	try {
		const authHeader: any = action.request.headers["authorization"];
		var success: boolean = false;
		if (authHeader) {
			const accessToken = authHeader.split(" ")[1];
			const authService = Container.get(AuthService);
			const userData: any = await authService.getUserbyAccessToken(accessToken);

			if (userData && userData.tokens.accessToken === accessToken) {
				if (roles && roles.length > 0) {
					userData.user.roles.forEach((role: any) => {
						if (roles.includes(role.role)) {
							Context.setCurrentUser(userData.user);
							success = true;
							return success;
						}
						return success;
					});
					return success;
				}
			}
		}
		return success;
	} catch (error) {
		throw error;
	}
}

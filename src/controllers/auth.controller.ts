import {
	Authorized,
	Body,
	Get,
	HeaderParam,
	JsonController,
	Post,
	Put,
	QueryParams,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import Container, { Service } from "typedi";
import { BaseService } from "../core/base.service";
import { AuthService } from "../services/auth.service";
import {
	LoginRequest,
	PostUserOrgAccessToken,
	PutUserAccessToken,
	ResetPasswordRequest,
	ResetPasswordVerifyRequest,
	SignUpRequest,
	updatePasswordRequest,
	VerifyUserRequest,
} from "./request";
import { CommonStatusResponse } from "./response";
import {
	AuthAccessRefreshTokenResponse,
	AuthLoginResponse,
	CurrentUserResponse,
} from "./response/auth.response";

@JsonController()
@Service()
export class AuthController extends BaseService {
	private _authService: AuthService;

	constructor() {
		super(__filename);
		this._authService = Container.get(AuthService);
	}

	//#region POST user signup
	@Post("/gateway/signup")
	@OpenAPI({
		summary: "Create a new user",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(CommonStatusResponse)
	async signup(@Body({ required: true }) request: SignUpRequest) {
		this._logger.info(`Creating user`);
		return await this._authService.createUser(request);
	}
	//#endregion POST user signup

	//#region POST user verify email
	@Put("/gateway/verify-email")
	@OpenAPI({
		summary: "verify user email",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(CommonStatusResponse)
	async verifyEmail(@Body({ required: true }) request: VerifyUserRequest) {
		this._logger.info(`Verifying user email id and string the password`);
		await this._authService.verifyUser(request);
	}
	//#endregion POST user verify email

	//#region POST user login
	@Post("/gateway/login")
	@OpenAPI({
		summary: "Login user",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(AuthLoginResponse)
	async login(@Body({ required: true }) request: LoginRequest) {
		this._logger.info(`Creating user`);
		return await this._authService.loginUser(request);
	}
	//#endregion POST user login

	//#region GET Reset password
	@Get("/gateway/reset-password")
	@OpenAPI({
		summary: "Reset user password",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(CommonStatusResponse)
	async resetPassword(@QueryParams() queryParams: ResetPasswordRequest) {
		this._logger.info(`Reseting user password`);
		await this._authService.resetUserPassword(queryParams);
	}
	//#endregion GET Reset password

	//#region POST Reset password verification
	@Post("/gateway/reset-password")
	@OpenAPI({
		summary: "Verify reset password",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(CommonStatusResponse)
	async verifyResetPassword(
		@Body({ required: true }) request: ResetPasswordVerifyRequest
	) {
		this._logger.info(`Reseting user password`);
		await this._authService.verifyResetPassword(request);
	}
	//#endregion POST Reset password verification

	//#region POST Current User
	@Get("/gateway/currentUser")
	@OpenAPI({
		summary: "Get user info by access token",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(CurrentUserResponse)
	async getCurrentUser(
		@HeaderParam("authorization") authToken: string
	): Promise<CurrentUserResponse> {
		this._logger.info(`Get current user by access token`);
		const userInfo = await this._authService.getCurrentUser(authToken);
		return {
			user: userInfo.user,
		};
	}
	//#endregion POST Current User

	//#region PUT Access token by access Token
	@Put("/gateway/token/refresh")
	@OpenAPI({
		summary: "Get Access Token by refresh token",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(AuthAccessRefreshTokenResponse)
	async putAccessToken(
		@Body({ required: true }) request: PutUserAccessToken
	): Promise<AuthAccessRefreshTokenResponse> {
		this._logger.info(`Get Access Token by refresh Token`);
		return await this._authService.putUserRefreshAccessToken(
			request.accessToken,
			request.refreshToken
		);
	}
	//#endregion PUT Access token by access Token

	//#region GET user logout
	@Get("/gateway/logout")
	@OpenAPI({
		summary: "Logout user",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(CommonStatusResponse)
	async logoutUser(@HeaderParam("authorization") token: string) {
		this._logger.info(`Logout User`);
		await this._authService.logoutUser(token);
	}
	//#endregion GET user logout

	@Post("/gateway/accessToken")
	@OpenAPI({
		summary: "Get user Org related acccess token",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(AuthLoginResponse)
	async userOrgToken(@Body({ required: true }) request: PostUserOrgAccessToken) {
		this._logger.info(`Creating user org access token`);
		return await this._authService.createOrgAccessTokens(
			request.accessToken,
			request.organizationId
		);
	}

	//#region POST update password verification
	@Authorized(["superAdmin"])
	@Put("/gateway/update-password")
	@OpenAPI({
		summary: "update password",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(CommonStatusResponse)
	async updatePassword(@Body({ required: true }) request: updatePasswordRequest) {
		this._logger.info(`Updating user password`);
		await this._authService.updateUserPassword(request);
	}
	//#endregion POST Reset password verification
}

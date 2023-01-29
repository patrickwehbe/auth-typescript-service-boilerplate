import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";
import {
	LoginRequest,
	ResetPasswordRequest,
	ResetPasswordVerifyRequest,
	SignUpRequest,
	updatePasswordRequest,
	VerifyUserRequest,
} from "../controllers/request";
import {
	AuthAccessRefreshTokenResponse,
	AuthLoginResponse,
} from "../controllers/response/auth.response";
import { BaseService, Context } from "../core";
import { LogicalError, UnauthorizedError } from "../core/errors";
import { ErrorResponse } from "../core/models";
import { HttpClientService, RedisService } from "../core/services";
import { env } from "../env";
import { AuthRepository, IAccessToken, IResetPasswordToken } from "../repositories";
import { HashService } from "./hash.service";
import { TokenService } from "./token.service";

@Service()
export class AuthService extends BaseService {
	private _httpClient: HttpClientService;

	constructor(
		private _authRepo: AuthRepository,
		private _tokenService: TokenService,
		private _hashService: HashService,
		private readonly _redisService: RedisService
	) {
		super(__filename);
		this._httpClient = new HttpClientService(this._logger);
	}

	async createUser(user: SignUpRequest): Promise<any> {
		this._logger.info("Creating user...");
	}

	async verifyUser(request: VerifyUserRequest): Promise<any> {
		try {
			this._tokenService.verifyToken(request.token);
			const orgUser: any = await this._redisService.getAsync("Auth", request.token);
			const hashPassword = await this._hashService.generateHash(request.password);
			const user = await this._authRepo.createUser({
				email: orgUser.email,
				password: hashPassword,
			});
		} catch (error: any) {
			if (error.message) {
				throw new UnauthorizedError(error.message);
			}
			throw new UnauthorizedError("Verify email token is invalid");
		}
	}

	async loginUser(request: LoginRequest): Promise<AuthLoginResponse> {
		const user = await this._authRepo.getUserByEmail(request.email);
		const isUserLegit = await this._hashService.verifyHash(
			request.password,
			user.password
		);
		if (isUserLegit) {
			const userInfo = await this.getUserInfo(request.email);

			const accessToken = this.generateAccessToken(
				Context.getRequestId(),
				user._key as string
			);
			const refreshToken = this.generateRefreshToken(
				Context.getRequestId(),
				user._key as string
			);

			const userAuthResponse = {
				user: userInfo,
				tokens: {
					accessToken: accessToken.token,
					accessTokenExpiresAt: accessToken.expiresAt,
					refreshToken: refreshToken.token,
					refreshTokenExpiresAt: refreshToken.expiresAt,
				},
			};
			await this._redisService.setAsync(
				"Auth",
				user._key as string,
				userAuthResponse
			);
			return userAuthResponse as any;
		} else {
			throw new UnauthorizedError("Password is incorrect");
		}
	}

	public async createOrgAccessTokens(userAccessToken: string, organizationId: string) {
		const userInfo = await this.getUserbyAccessToken(userAccessToken);
		const userRoleOrg = userInfo.user.roles?.find(
			(element) => element.organizationId === organizationId
		);
		if (userRoleOrg) {
			const accessToken = this.generateAccessToken(
				Context.getRequestId(),
				userInfo.user.identityId
			);
			const refreshToken = this.generateRefreshToken(
				Context.getRequestId(),
				userInfo.user.identityId
			);

			const userAuthResponse = {
				user: { ...userInfo.user, ...userRoleOrg },
				tokens: {
					accessToken: accessToken.token,
					accessTokenExpiresAt: accessToken.expiresAt,
					refreshToken: refreshToken.token,
					refreshTokenExpiresAt: refreshToken.expiresAt,
				},
			};
			await this._redisService.setAsync(
				"Auth",
				userInfo.user.identityId,
				userAuthResponse
			);
			return userAuthResponse;
		} else {
			throw new BadRequestError(
				"User is not assigned to the requested organisation"
			);
		}
	}

	private async getUserInfo(email: string) {}
	private generateAccessToken(requestId: string, identityId: string) {
		const token = this._tokenService.createToken(
			{
				requestId: requestId,
				identityId: identityId,
			},
			env.auth.jwtExpireIn
		);

		return {
			token: token,
			expiresAt: new Date(new Date().getTime() + env.auth.jwtExpireIn * 1000),
		};
	}

	private generateRefreshToken(requestId: string, identityId: string) {
		const token = this._tokenService.createToken(
			{
				requestId: requestId,
				identityId: identityId,
			},
			env.auth.jwtRefreshIn
		);

		return {
			token: token,
			expiresAt: new Date(new Date().getTime() + env.auth.jwtRefreshIn * 1000),
		};
	}

	async resetUserPassword(request: ResetPasswordRequest): Promise<void> {
		const userInfo = await this.getUserInfo(request.email);

		const resetToken = this._tokenService.createToken(
			{
				email: request.email,
				requestId: Context.getRequestId(),
			},
			env.auth.jwtExpireIn
		);

		this._logger.info(resetToken);

		//set reset token into the cache
		await this._redisService.setAsync("Auth", resetToken, request.email);

		//send an email to notification service
	}

	async verifyResetPassword(request: ResetPasswordVerifyRequest): Promise<void> {
		try {
			const decodedToken = this._tokenService.verifyToken<IResetPasswordToken>(
				request.token
			);
			const userEmail: any = await this._redisService.getAsync(
				"Auth",
				request.token
			);
			if (decodedToken.data.email === userEmail) {
				const hashPassword = await this._hashService.generateHash(
					request.password
				);
				const user = await this._authRepo.updateUser({
					email: userEmail,
					password: hashPassword,
				});
				await this._redisService.deleteAsync("Auth", request.token);
			} else {
				throw new UnauthorizedError("Verify reset password token is invalid");
			}
		} catch (error) {
			throw new UnauthorizedError("Verify reset password token is invalid");
		}
	}

	async getUserbyAccessToken(accessToken: string): Promise<AuthLoginResponse> {
		const decodedToken = this._tokenService.verifyToken<IAccessToken>(accessToken);
		if (decodedToken) {
			const userInfo: AuthLoginResponse = await this._redisService.getAsync(
				"Auth",
				decodedToken.data.identityId
			);
			if (userInfo && userInfo.tokens.accessToken === accessToken) {
				return userInfo;
			} else {
				throw new UnauthorizedError("Access Token is invalid.");
			}
		} else {
			throw new UnauthorizedError("Access Token is invalid.");
		}
	}

	async putUserRefreshAccessToken(
		accessToken: string,
		refreshToken: string
	): Promise<AuthAccessRefreshTokenResponse> {
		const decodedToken = this._tokenService.verifyToken<IAccessToken>(refreshToken);
		if (decodedToken) {
			const userData: AuthLoginResponse = await this._redisService.getAsync(
				"Auth",
				decodedToken.data.identityId
			);
			// Check if the provided tokens (inputs) are the same as the ones stored in redis
			if (
				userData.tokens.accessToken === accessToken &&
				userData.tokens.refreshToken == refreshToken
			) {
				const accessToken = this.generateAccessToken(
					Context.getRequestId(),
					userData.user.id
				);
				const refreshToken = this.generateRefreshToken(
					Context.getRequestId(),
					userData.user.id
				);

				const userAuthResponse = {
					user: userData.user,
					tokens: {
						accessToken: accessToken.token,
						accessTokenExpiresAt: accessToken.expiresAt,
						refreshToken: refreshToken.token,
						refreshTokenExpiresAt: refreshToken.expiresAt,
					},
				};

				await this._redisService.setAsync(
					"Auth",
					decodedToken.data.identityId,
					userAuthResponse
				);
				return {
					accessToken: accessToken.token,
					refreshToken: refreshToken.token,
				};
			} else {
				throw new UnauthorizedError("Refresh or Access Token is invalid.");
			}
		} else {
			throw new UnauthorizedError("Refresh or Access Token is invalid.");
		}
	}

	async logoutUser(authHeader: string): Promise<void> {
		if (authHeader.startsWith("Bearer ")) {
			const accessToken = authHeader.substring(7, authHeader.length);
			const decodedToken =
				this._tokenService.verifyToken<IAccessToken>(accessToken);
			if (decodedToken) {
				await this._redisService.deleteAsync(
					"Auth",
					decodedToken.data.identityId
				);
			} else {
				throw new UnauthorizedError("Access Token is invalid.");
			}
		} else {
			throw new UnauthorizedError("Access Token is invalid.");
		}
	}

	async getCurrentUser(authHeader: string): Promise<AuthLoginResponse> {
		if (authHeader) {
			if (authHeader.startsWith("Bearer ")) {
				const accessToken = authHeader.substring(7, authHeader.length);
				const currentUser = await this.getUserbyAccessToken(accessToken);
				return currentUser;
			} else {
				throw new UnauthorizedError("Access Token is invalid.");
			}
		} else {
			throw new UnauthorizedError("Access Token is invalid.");
		}
	}

	async updateUserPassword(param: updatePasswordRequest): Promise<void> {
		const hashPassword = await this._hashService.generateHash(param.password);
		this._authRepo.updateUser({
			email: param.email,
			password: hashPassword,
		});
	}
}

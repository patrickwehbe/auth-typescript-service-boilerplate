import { Service } from "typedi";
import { NotFoundError } from "../core/errors";
import { ArangoService } from "../core/services/database/arangodb/services";
import { BaseRepository } from "../core/base.repository";
import { User } from "../models";
import { IAuthRepository, IUpdateUser } from "./interfaces";

@Service()
export class AuthRepository extends BaseRepository implements IAuthRepository {
	constructor(arangoService: ArangoService) {
		super(__filename, arangoService);
	}

	async getUserByEmail(email: string): Promise<User> {
		const query = `
				FOR u in user
				FILTER u.email == @email
				AND u.isActive == true
				RETURN u
		`;

		const params = {
			email,
		};

		const getUser = await this._database.query<User, any>(query, params);

		if (!getUser || getUser.length === 0)
			throw new NotFoundError(`User with email: ${email} not found in database`);

		//By default the arango query returns an array. We need to always get the first element
		return getUser.shift() as User;
	}

	async createUser(user: User): Promise<User> {
		this._logger.info(`Adding new user in database`);

		const createdUser = await this._database.transaction<User[], any>(
			{
				write: ["user"],
			},
			(params) => {
				const db = require("@arangodb").db;
				//Custom ArangoDB error generator
				const handledError = require("@arangodb").ArangoError();
				handledError.errorNum = 400;

				// check user already exist in the database
				const userAlreadyExistQuery = `
                 FOR u in user
                 FILTER u.isActive == true
                 AND u.email == @email
                 RETURN u`;

				const userAlreadyExistsParams = {
					email: params.user.email,
				};

				const userAlreadyExists = db
					._query(userAlreadyExistQuery, userAlreadyExistsParams)
					.toArray();

				// If the user already exist, generate an error
				if (userAlreadyExists && userAlreadyExists.length > 0) {
					// generate an Arango handled error
					handledError.errorMessage = `user with email: ${params.user.email} already exists. Please choose a different email id`;
					throw handledError;
				}

				// insert user entry into the databse
				const userCreatequery = `
				INSERT @user INTO user
			    OPTIONS {keepNull: false}
				RETURN NEW
				`;
				params.user.createdAt = +new Date();
				params.user.isActive = true;

				const userCreateparams = { user: params.user };

				const createdUser = db
					._query(userCreatequery, userCreateparams)
					.toArray();
				return createdUser;
			},
			{
				user,
			}
		);

		//By default the arango query returns an array. We need to always get the first element
		return createdUser.shift() as User;
	}

	async updateUser(user: IUpdateUser): Promise<User> {
		this._logger.info(`update user with key ${user.email}`);

		const query = `
			FOR u in user
				FILTER u.email == @email
				UPDATE u
					WITH {
						password: @password == null ? u.password : @password,
                        isActive: @isActive == null ? u.isActive : @isActive,
						modifiedAt: @timestamp
					}
				IN user
				OPTIONS {keepNull: false}
				RETURN NEW
		`;

		const params = {
			email: user.email,
			password: user.password ? user.password : null,
			isActive: user.isActive ? user.isActive : null,
			timestamp: +new Date(),
		};

		const updatedUser = await this._database.query<User, any>(query, params);

		if (!updatedUser || updatedUser.length === 0)
			throw new NotFoundError(
				`User with email: ${user.email} not found in database`
			);

		//By default the arango query returns an array. We need to always get the first element
		return updatedUser.shift() as User;
	}
}

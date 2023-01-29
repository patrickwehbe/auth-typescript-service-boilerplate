import { Model } from "../core/models/arango.model";

export class User extends Model {
	/**
	 * email of user
	 */
	email: string;

	/**
	 * password in hash format of user
	 */
	password: string;
}

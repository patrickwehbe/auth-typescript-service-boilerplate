import bcrypt from "bcrypt";
import { Service } from "typedi";
import { BaseService } from "../core/base.service";
import { env } from "../env";

@Service()
export class HashService extends BaseService {
	constructor() {
		super(__filename);
	}

	async generateHash(data: string): Promise<string> {
		const hashSalt = await bcrypt.genSalt(env.auth.hashSaltRounds);
		const hashData = await bcrypt.hash(data, hashSalt);
		return hashData;
	}

	async verifyHash(data: string, hashData: string): Promise<boolean> {
		return await bcrypt.compare(data, hashData);
	}
}

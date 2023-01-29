import jwt from 'jsonwebtoken';
import { Service } from "typedi";
import { BaseService } from "../core/base.service";
import { env } from "../env";

@Service()
export class TokenService extends BaseService {
	
	constructor() {
		super(__filename);
	}

	createToken(payload: string | Buffer | object, jwtExpireIn:number):string{

		const token=  jwt.sign({data:payload}, env.auth.jwtSecret, {
			expiresIn:jwtExpireIn
		})
		return token;
	}
	
	verifyToken<T>(token:string):T{
		
		const decodedData= jwt.verify(token, env.auth.jwtSecret);
		return decodedData as T;
	}


}

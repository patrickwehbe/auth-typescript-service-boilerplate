import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface } from 'routing-controllers';
import Container, { Service } from "typedi";
import { AuthLoginResponse } from '../controllers/response';
import { Context } from '../core';
import { UnauthorizedError } from '../common/errors';
import { AuthService } from '../services';

@Service()
export class UserAuthorization implements ExpressMiddlewareInterface {
  
  private _authService: AuthService;
  constructor() {
		this._authService = Container.get(AuthService);
	}

  public async use(req: Request, res: Response, next: NextFunction): Promise<any> {

    const authHeader = req.headers["authorization"];
    if(authHeader)
    {
      if (authHeader.startsWith("Bearer ")){
        const accessToken = authHeader.substring(7, authHeader.length);
        const userData:AuthLoginResponse = await this._authService.getUserbyAccessToken(accessToken);
        Context.setOrgId(userData.user.organizationId);
        Context.setCurrentUser(userData.user);
        next();  

      }
      else {
        throw new UnauthorizedError("Invalid Authorization Header");
      }
     

    }
    else{
        throw new UnauthorizedError("User not Logged In.");
    }
}
}
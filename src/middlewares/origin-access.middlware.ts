import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import Container, { Service } from "typedi";
import { Context } from '../core';
import { AuthService } from '../services';

@Middleware({ type: "before" })
@Service()
export class OriginAccessMiddleware implements ExpressMiddlewareInterface {
  
  private _authService: AuthService;
  constructor() {
		this._authService = Container.get(AuthService);
	}

  public async use(req: Request, res: Response, next: NextFunction): Promise<any> {

    if(req.headers["authorization"])
    {
      next();
    }
    else
    {
        const origin = req.get('origin');
        if(origin)
        {
          const orgId = await this._authService.getOrgIdByDomainWhitelisted(origin);
          if(orgId)
          {
            Context.setOrgId(orgId);
          }
        }
        next();
    }
  }
}

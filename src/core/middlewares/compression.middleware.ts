import compression from "compression";
import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";

/**
 * Compress the responses
 */
@Middleware({ type: "before" })
@Service()
export class CompressionMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response, next: NextFunction) {
    return compression()(req, res, next);
  }
}

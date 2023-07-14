import { Response, Request, NextFunction } from "express";
export interface AuthInterface {
  register: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  verifyEmail: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  login: (req: Request, res: Response, next: NextFunction) => Promise<any>;
 
}

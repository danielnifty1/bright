import { NextFunction,Response,Request } from "express";

export interface UserInterface {
  fetchProfile: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  fetchUser: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  fetchUsers: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

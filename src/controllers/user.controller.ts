import successResponse from "../helpers/success_response";
import customError from "../helpers/custom_error";
import { customRequest } from "../interfaces/user_custom_request_body.interface";
import { Response, Request, NextFunction } from "express";
import UserEntity from "../model/User";
import { UserInterface } from "../interfaces/user.controller.interface";

class User implements UserInterface {
  constructor(private readonly userEntity: any) {
    this.fetchUsers = this.fetchUsers.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
    this.fetchProfile = this.fetchProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  public async fetchProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { userData } = req as unknown as customRequest;
      successResponse(res, userData, 200, "Profile Fetched Successfully");
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }

  public async fetchUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { id } = req.params;

      const user = await this.userEntity.findById(id);
      if (!user) {
        return next(new customError("User not found", 404));
      }
      successResponse(res, user, 200, "User profile fetched successfully");
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }
  public async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { email, first_name, last_name } = req.body;
      const currentUser = await this.fetchProfile(req, res, next);
      const id = await currentUser.data._id;
      const updatedUser = await this.userEntity.findByIdAndUpdate(
        id,
        {
          email,
          first_name,
          last_name,
        },
        { runValidator: true, new: true }
      );
      successResponse(
        res,
        updatedUser,
        200,
        "User profile updated successfully"
      );
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }

  public async fetchUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const users = await this.userEntity.find().query(req.query);

      successResponse(res, users, 200, "Users fetched successfully");
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }
}

export default new User(UserEntity);

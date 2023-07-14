import successResponse from "../helpers/success_response";
import customError from "../helpers/custom_error";
import nodemailer from "../utils/nodeMailer";
import { Response, Request, NextFunction } from "express";
import UserEntity from "../model/User";
import OtpEntity from "../model/Otp";
import {APP_NAME} from "../constants"
import endpoint from "../config/endpoints.config";
import { AuthInterface } from "../interfaces/auth.controller.interface";


class Auth implements AuthInterface {
  constructor(
    private readonly userEntity: typeof UserEntity,
    private readonly otpEntity: typeof OtpEntity
  ) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getOtp = this.getOtp.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
  }
  

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { first_name, last_name, phone, password, email } = req.body;
    try {
      const data = await this.userEntity.create({
        first_name,
        last_name,
        phone,
        email,
        password,
      });
      await data.save();
      //---send welcome email---//
      await this.getOtp(
        email,
        next,
        `Congratulations!!! you have successfully created an account with ${APP_NAME}. here is your email verification OTP.
        `
      );
      // ---------------------------------------//
      successResponse(res, data, 201, "Registeration successfully");
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }

 
  private async getOtp(
    email: string,
    next: NextFunction,
    message?: string
  ): Promise<any> {
    try {
      // destructure body

      if (!email) {
        return next(new customError(" registered email required", 400));
      }
      const user = await this.userEntity.findOne({ email });
      if (!user) {
        return next(
          new customError("User information does not exist in  database", 400)
        );
      }

      const newOtp = await this.otpEntity.create({ user: user._id });
      const generatedOtp = await newOtp.getOtp();
      await newOtp.save();

      //---send otp to email---//
      await nodemailer(
        email,
        endpoint.contactAddress,
        message
          ? `${message}: ${generatedOtp},
          It expires in 5 minutes`
          : `here is your OTP: ${generatedOtp}.
        It expires in 5 minutes`,
        "OTP"
      );
      // ---------------------------------------//
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }

  public async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {

      const { otp } = req.body;

      if (!otp) {
        return next(new customError("Otp required", 400));
      }

      if (otp < 6) {
        return next(new customError("Invalid OTP", 400));
      }

      const isOtp = await this.otpEntity
        .findOne({
          otp,
          expires: { $gt: new Date(Date.now()) },
        })
        .select("+otp");

      if (!isOtp) {
        return next(new customError("Otp expired or does not exist", 403));
      }

      const authUser = await this.userEntity.findByIdAndUpdate(
        isOtp.user,
        { $set: { email_verified: true } },
        { runValidators: true, new: true }
      );

      // delete otp record
      await this.otpEntity.findOneAndDelete({ _id: isOtp._id });
      successResponse(res, authUser, 200, "Email verify  successful");
    } catch (error: any) {
      return next(new customError(error.message, 500));
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // destructure body
      const { email, password } = req.body;

      const isUser = await this.userEntity
        .findOne({ email })
        .select(["+password", "email_verified"]);

      if (!isUser) {
        return next(
          new customError("User with provided  email does not exist", 404)
        );
      }
      if (isUser.email_verified == false) {
         //---send welcome email---//
      await this.getOtp(
        email,
        next,
        `here is your email verification OTP.
        `
      );
      // ---------------------------------------//
        return next(new customError("Your email isnt verified yet", 400));
      }

      // compare password
      const isPasswordCorrect = await isUser.comparePassword(password);
      if (!isPasswordCorrect) {
        return next(
          new customError(
            "Sorry,email  and password combination didnt work",
            401
          )
        );
        
      }
      //get fresh user
       const authUser = await this.userEntity.findOne({email});

  // `     const authUser = await this.userEntity.findOne(req.body.password);`
      const token = await authUser?.getToken();
      successResponse(res, authUser, 200, "Login  successful", token);
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }
  
}

export default new Auth(UserEntity, OtpEntity);

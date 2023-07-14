import { Schema, model } from "mongoose";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";
import endPoint from "../config/endpoints.config";
import * as otpGenerator from "otp-generator";
export interface OtpInt {
  user: any;
  otp: number;
  expires: Date;
  getOtp: () => Promise<string>
}

const Otp = new Schema<OtpInt>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please provide an object id"],
    },
    otp: { type: Number, select: false, length: 6 },
    expires: { type: Date },
  },
  { timestamps: true }
);

Otp.methods.getOtp = async function () {
  var otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false, specialChars: false,
    lowerCaseAlphabets: false
  });
  console.log(otp)
  this.otp = otp;
  console.log(this.otp, "set otp");
  //   epires in 5 minutes
  this.expires = new Date(Date.now() + 5 * 60 * 1000);

  return otp;
};
export default model("Otp", Otp);

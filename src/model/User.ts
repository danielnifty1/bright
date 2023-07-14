import * as bcrypt from "bcrypt";
import generateJWT from "../utils/generateJWT";
import { Schema, model } from "mongoose";
import { Roles } from "../types/roles";
import { UserInterface } from "../interfaces/user.model.interface";

const User = new Schema<UserInterface>(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, "please include a first name"],
    },

    last_name: {
      type: String,
      trim: true,
      required: [true, "please include a last name"],
    },

    linked: {
      type: String,
      trim: true,

    },
    instagram: {
      type: String,
      trim: true,

    },

    coached: {
      type: Boolean,
      default: false,

    },
    password: {
      type: String,
      select: false,
      required: [true, "please include a password "],
    },
    email_verified: { type: Boolean, default: false },
    email: {
      required: [true, "please include an email"],
      type: String,
      unique: true,
      match: [
        // eslint-disable-next-line no-useless-escape
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "please add a valid email",
      ],
    },

    role: {
      required: true,
      type: String,
      enum: Roles,
      default: Roles.USER,
    },
  },
  { timestamps: true }
);

User.methods.getToken = async function () {
  var token = generateJWT({ id: this._id });
  console.log(token);
  return token;
};

User.methods.comparePassword = async function (password: string) {
  console.log(password,this.password)
  const isPassword = bcrypt.compareSync(password, this.password);
  console.log(isPassword);
  return isPassword;
};

User.pre("save", async function (next) {
  if (!this.isModified("password"))
  {
    return next()
  } 
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    console.log(this.password);
  

});

export default model("user", User);

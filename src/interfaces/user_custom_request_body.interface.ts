import { ObjectId } from "mongoose";
export interface customRequest extends Request {
  userId: ObjectId;
  userData: any;
  userRole: string;
}

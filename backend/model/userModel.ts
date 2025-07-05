import { Schema, model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

export interface IUser {
  _id?: string;
  fname: string;
  lname: string;
  username: string;
  email: string;
  password: string;
  friends: string[];
}

const userSchema = new Schema<IUser>({
  fname: { type: String, require: true },
  lname: { type: String, require: true },
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  friends: { type: [String], require: true, default: [] },
});

mongooseUniqueValidator(userSchema);

const User = model<IUser>("User", userSchema);

export default User;

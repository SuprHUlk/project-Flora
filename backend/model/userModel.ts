import { Schema, model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

export interface IUser {
  fname: string;
  lname: string;
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  fname: { type: String, require: true },
  lname: { type: String, require: true },
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

mongooseUniqueValidator(userSchema);

const User = model<IUser>('User', userSchema);

export default User;

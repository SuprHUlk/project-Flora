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
    photoUrl?: string;
    website?: string;
    bio?: string;
    gender?: string;
}

const userSchema = new Schema<IUser>({
    fname: { type: String, require: true },
    lname: { type: String, require: true },
    username: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    friends: { type: [String], require: true, default: [] },
    photoUrl: {
        type: String,
        require: false,
        default:
            "https://static.vecteezy.com/system/resources/previews/001/840/618/large_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg",
    },
    website: { type: String, required: false },
    bio: { type: String, require: false },
    gender: { type: String, require: false },
});

mongooseUniqueValidator(userSchema);

const User = model<IUser>("User", userSchema);

export default User;

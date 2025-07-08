import logger from "../../config/logger";
import { Response } from "../../model/responseModel";
import { IUser } from "../../model/userModel";
import User from "../../model/userModel";

async function get(user: IUser): Promise<Response> {
    try {
        const userProfile = (await User.findOne(
            { _id: user._id },
            "_id username photoUrl email fname lname"
        ))!;
        return { status: 200, json: userProfile };
    } catch (err) {
        return { status: 500, json: err };
    }
}

async function getFriends(user: IUser): Promise<Response> {
    try {
        const userProfile = (await User.findOne({ _id: user._id }))!;

        const friends = userProfile.friends;

        const users = await User.find(
            {
                _id: { $in: friends },
            },
            "_id username photoUrl fname lname"
        );
        return { status: 200, json: users };
    } catch (err) {
        return { status: 500, json: err };
    }
}

export { get, getFriends };

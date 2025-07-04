import {
  ILetter,
  ILetterRequest,
  ILetterResponse,
} from "../../model/letterModel";
import { Response } from "../../model/responseModel";
import { IUser } from "../../model/userModel";
import User from "../../model/userModel";
import Letter from "../../model/letterModel";

async function send(letter: ILetterRequest, user: IUser): Promise<Response> {
  try {
    let users = await User.find({});

    console.log(users);
    users = users.filter((usr) => {
      if (usr._id.toString() != user._id!.toString()) {
        return usr;
      }
    });
    console.log(users);
    const receiver = users[Math.floor(Math.random() * users.length)];
    console.log(receiver);

    const newLetter = new Letter({
      message: letter.message,
      sender: user._id!.toString(),
      receiver: receiver._id.toString(),
      pastReceiver: [],
    });

    await newLetter.save();

    return {
      status: 200,
      json: {
        msg: "Letter sent",
      },
    };
  } catch (err) {
    return { status: 500, json: err };
  }
}

async function reSend(
  letterRequest: ILetterRequest,
  _: IUser
): Promise<Response> {
  try {
    let users = await User.find({});

    const letter = await Letter.findOne({ _id: letterRequest._id });

    if (!letter) {
      return { status: 404, json: { msg: "Letter not found" } };
    }

    //delete (status = false) the letter if sent to 5 users
    if (letter.pastReceiver.length >= 5) {
      letter.status = false;
    } else {
      //remove pastReceivers from the list
      users = users.filter((usr) => {
        if (
          !letter.pastReceiver.includes(usr._id.toString()) &&
          usr._id.toString() != letter.sender &&
          usr._id?.toString() != letter.receiver
        ) {
          return usr;
        }
      });

      //delete (status = false) the letter if no users are left
      if (users.length == 0) {
        letter.status = false;
      } else {
        const receiver = users[Math.floor(Math.random() * users.length)];

        letter.pastReceiver.push(letter.receiver);

        letter.receiver = receiver._id;
      }
    }
    await letter.save();
    return { status: 200, json: { msg: "Successfull" } };
  } catch (err) {
    return { status: 500, json: err };
  }
}

async function received(user: IUser): Promise<Response> {
  try {
    const letters = await Letter.find({
      receiver: user._id,
      status: true,
      accepted: false,
    });
    const modifiedLetters = letters.map((letter) => {
      const modifiedLetter: ILetterResponse = {
        _id: letter._id.toString(),
        message: letter.message,
        receivedDate: letter.updatedAt,
      };

      return modifiedLetter;
    });
    return {
      status: 200,
      json: {
        msg: "Successfull",
        letters: modifiedLetters,
      },
    };
  } catch (err) {
    return { status: 500, json: err };
  }
}

async function get(user: IUser): Promise<Response> {
  try {
    const letters = await Letter.find({
      sender: user._id,
      status: true,
      accepted: false,
    });

    const modifiedLetters = letters.map((letter) => {
      const modifiedLetter: ILetterResponse = {
        _id: letter._id.toString(),
        message: letter.message,
        sentDate: letter.createdAt,
      };

      return modifiedLetter;
    });

    return {
      status: 200,
      json: {
        msg: "Successfull",
        letters: modifiedLetters,
      },
    };
  } catch (err) {
    return { status: 500, json: err };
  }
}

async function accept(
  letterRequest: ILetterRequest,
  user: IUser
): Promise<Response> {
  try {
    const letter = await Letter.findOne({ _id: letterRequest._id });

    if (!letter) {
      return { status: 404, json: { msg: "Letter not found" } };
    }

    const sender = await User.findOne({ _id: letter.sender });
    const receiver = await User.findOne({ _id: user._id });
    sender!.friends.push(receiver!._id);
    receiver!.friends.push(sender!._id);

    letter.accepted = true;
    letter.status = false;

    letter.save();
    sender!.save();
    receiver!.save();

    return {
      status: 200,
      json: {
        msg: "Your are now friends with " + sender?.username + " enjoy!!",
      },
    };
  } catch (err) {
    return { status: 500, json: err };
  }
}

export { send, reSend, received, get, accept };

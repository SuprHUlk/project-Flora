import { IUser } from "../../model/userModel";
import User from "../../model/userModel";
import { Response } from "../../model/responseModel";
import { Login } from "../../model/loginModel";
import jwt from "jsonwebtoken";
import { Response as ExpressResponse } from "express";
import firebaseDb from "../../config/firebaseInit";

import bcrypt from "bcryptjs";

const SECRET_KEY: string = process.env.SECRET_KEY!;
const TOKEN_EXPIRATION_TIME: number = parseInt(
  process.env.TOKEN_EXPIRATION_TIME!
);

async function email(userBody: IUser): Promise<Response> {
  try {
    const hashedPass = bcrypt.hashSync(userBody.password, 10);
    userBody.password = hashedPass;
    await addUser(userBody);
    return {
      status: 200,
      json: {
        msg: "User sign-up successfull",
      },
    };
  } catch (err) {
    return {
      status: 500,
      json: err,
    };
  }
}

async function auth(loginBody: Login, res: ExpressResponse): Promise<Response> {
  try {
    const user =
      (await User.findOne({ email: loginBody.email })) ??
      (await User.findOne({ username: loginBody.email }));

    if (!user) {
      return {
        status: 404,
        json: {
          msg: "User does not exist",
        },
      };
    }

    const isPasswordCorrect = bcrypt.compareSync(
      loginBody.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return {
        status: 401,
        json: {
          msg: "Please check your email and password",
        },
      };
    }

    addJWT(user._id.toString(), user.email, user.password, res);

    return {
      status: 200,
      json: {
        msg: "User login successfull",
        ExpirationTime: TOKEN_EXPIRATION_TIME,
        user: {
          _id: user._id.toString(),
          fname: user.fname,
          lname: user.lname,
          username: user.username,
          email: user.email,
        },
      },
    };
  } catch (err) {
    return {
      status: 500,
      json: err,
    };
  }
}

function logout(res: ExpressResponse): Response {
  res.clearCookie("token");
  return { status: 200, json: { msg: "Logged out" } };
}

function verify(): Response {
  return { status: 200, json: {} };
}

async function google(
  userBody: IUser,
  res: ExpressResponse
): Promise<Response> {
  let _id = "";
  const hashedPass = bcrypt.hashSync(userBody.password, 10);
  userBody.password = hashedPass;

  try {
    try {
      await firebaseDb.auth().getUser(userBody.password);
      const userMongoDb =
        (await User.findOne({ email: userBody.email })) ??
        (await User.findOne({ username: userBody.username }));

      _id = userMongoDb!._id.toString();
    } catch (err) {
      _id = await addUser(userBody);
    } finally {
      addJWT(_id, userBody.email, userBody.username, res);

      return {
        status: 200,
        json: {
          msg: "User login successfull",
          ExpirationTime: TOKEN_EXPIRATION_TIME,
          user: {
            _id,
            fname: userBody.fname,
            lname: userBody.lname,
            username: userBody.username,
            email: userBody.email,
          },
        },
      };
    }
  } catch (err) {
    return { status: 500, json: err };
  }
}

function addJWT(
  _id: string,
  email: string,
  username: string,
  res: ExpressResponse
) {
  const token = jwt.sign(
    {
      _id,
      email,
      username,
    },
    SECRET_KEY,
    { expiresIn: TOKEN_EXPIRATION_TIME }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: TOKEN_EXPIRATION_TIME,
  });
}

async function addUser(userBody: IUser): Promise<string> {
  try {
    const user = new User({
      fname: userBody.fname,
      lname: userBody.lname,
      username: userBody.username,
      email: userBody.email,
      password: userBody.password,
    });

    const savedUser = await user.save();
    return savedUser._id.toString();
  } catch (err) {
    throw err;
  }
}

export { email, auth, logout, verify, google };

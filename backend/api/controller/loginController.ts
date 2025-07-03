import { IUser } from "../../model/userModel";
import User from "../../model/userModel";
import { Response } from "../../model/responseModel";
import { Login } from "../../model/loginModel";
import jwt from "jsonwebtoken";
import { Response as ExpressResponse } from "express";

import bcrypt from "bcryptjs";

const SECRET_KEY: string = process.env.SECRET_KEY!;
const TOKEN_EXPIRATION_TIME: number = parseInt(
  process.env.TOKEN_EXPIRATION_TIME!
);

async function email(userBody: IUser): Promise<Response> {
  return await signup(userBody);
}

async function signup(userBody: IUser): Promise<Response> {
  try {
    const hashedPass = bcrypt.hashSync(userBody.password, 10);
    const user = new User({
      fname: userBody.fname,
      lname: userBody.lname,
      username: userBody.username,
      email: userBody.email,
      password: hashedPass,
    });

    await user.save();
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

async function auth(loginBody: Login): Promise<Response> {
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

    const jwtKey = createJWT(user._id.toString(), user.email, user.password);

    return {
      status: 200,
      json: {
        msg: "User login successfull",
        token: jwtKey,
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

function createJWT(_id: string, email: string, username: string): string {
  return jwt.sign(
    {
      _id,
      email,
      username,
    },
    SECRET_KEY,
    { expiresIn: TOKEN_EXPIRATION_TIME }
  );
}

function logout(res: ExpressResponse): Response {
  res.clearCookie("token");
  return { status: 200, json: { msg: "Logged out" } };
}

function verify(): Response {
  return { status: 200, json: {} };
}

export { email, auth, logout, verify };

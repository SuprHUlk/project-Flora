import { IUser } from '../../model/userModel';
import User from '../../model/userModel';
import { Response } from '../../model/responseModel';
import { Login } from '../../model/loginModel';

import bcrypt from 'bcryptjs';

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
        msg: 'User sign-up successfull',
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
        status: 401,
        json: {
          msg: 'User does not exist',
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
          msg: 'Please check your email and password',
        },
      };
    }

    return {
      status: 200,
      json: {
        msg: 'User login successfull',
      },
    };
  } catch (err) {
    return {
      status: 500,
      json: err,
    };
  }
}

export { email, auth };

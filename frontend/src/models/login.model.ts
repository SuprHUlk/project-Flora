import User from './user.model';

export interface Login {
  email: string;
  password: string;
}

export interface LoginResponseData {
  ExpirationTime: number;
  msg: string;
  user: User;
}

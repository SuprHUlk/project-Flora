export default interface User {
  email: string;
  fname: string;
  lname: string;
  username: string;
  _id: string;
  ExpirationTime: number;
  photoUrl: string;
}

export interface Friend {
  _id: string;
  username: string;
  photoUrl: string;
  fname: string;
  lname: string;
}

// export class User {
//     constructor(
//         public email: string,
//         public fname: string,
//         public lname: string,
//         public _id: string,
//         private _token: string,
//         private _tokenExpirationDate: Date
//     ) {}

//     get token(){
//         if (!this._tokenExpirationDate || new Date()> this._tokenExpirationDate) {
//             return null;
//         }
//         return this._token;
//     }
// }

export default interface User {
  email: string;
  fname: string;
  lname: string;
  username: string;
  _id: string;
  ExpirationTime: number;
}

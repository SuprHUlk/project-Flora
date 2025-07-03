import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import User from '../models/user.model';
import { catchError, map, take, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Signup } from '../models/signup.model';
import { Login, LoginResponseData } from '../models/login.model';

interface refreshTokenResData {
  expires_in: string;
  id_token: string;
}

interface post {
  EMAIL_ADD: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  PASSWORD: string | null;
  USERNAME: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  user$ = new BehaviorSubject<boolean>(false);
  tokenExpirationTimer: any;
  model: post;
  productsRef: AngularFirestoreCollection<post>;
  posts: Observable<post[]>;
  private readonly mongoDbBaseApiUrl = environment.mongoDbBaseApiUrl + '/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private fireauth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.productsRef = this.afs.collection<post>('users');
  }

  // signup(email: string, pass: string) {
  //   return this.http
  //     .post<LoginResponseData>(
  //       'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
  //       { email: email, password: pass, returnSecureToken: true }
  //     )
  //     .pipe(
  //       catchError((errorRes) => {
  //         console.log(errorRes);
  //         if (!errorRes.error || !errorRes.error.error.message) {
  //           return throwError('UNKNOWN_ERROR');
  //         } else {
  //           switch (errorRes.error.error.message) {
  //             case 'EMAIL_EXISTS': {
  //               return throwError('EMAIL_EXISTS');
  //               break;
  //             }
  //             case 'WEAK_PASSWORD : Password should be at least 6 characters': {
  //               return throwError(
  //                 'WEAK_PASSWORD : Password should be at least 6 characters'
  //               );
  //               break;
  //             }
  //             default: {
  //               return throwError('UNKNOWN_ERROR');
  //             }
  //           }
  //         }
  //       }),
  //       tap((resData) => {
  //         const expirationDate = new Date(
  //           new Date().getTime() + +resData.expiresIn * 1000
  //         );
  //         const user = new User(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           expirationDate
  //         );
  //         this.user.next(user);
  //         localStorage.setItem('userData', JSON.stringify(user));
  //       })
  //     );
  // }

  signup(signupRequest: Signup) {
    return this.http.post(this.mongoDbBaseApiUrl + '/email', signupRequest, {
      withCredentials: true,
    });
  }

  login(loginRequest: Login) {
    return this.http
      .post<LoginResponseData>(this.mongoDbBaseApiUrl + '/auth', loginRequest, {
        withCredentials: true,
      })
      .pipe(
        tap((res: LoginResponseData) => {
          this.autoLogout(res.ExpirationTime);
        }),
        map((resData: LoginResponseData) => {
          return resData.user;
        })
      );
  }

  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        console.log(res);
        if (res.additionalUserInfo!.isNewUser) {
          this.model = {
            EMAIL_ADD: res.user!.email!,
            FIRST_NAME: res.user!.displayName!.split(' ')[0],
            LAST_NAME:
              res.user!.displayName!.split(' ')[
                res.user!.displayName!.split(' ').length - 1
              ],
            PASSWORD: null,
            USERNAME: res.user!.displayName!,
          };
          this.productsRef.doc(res.user!.email!).set(this.model); //.then( _ => alert("hogya send"));
        }
        this.http
          .post<refreshTokenResData>(
            'https://securetoken.googleapis.com/v1/token?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
            {
              grant_type: 'refresh_token',
              refresh_token: res.user!.refreshToken,
            }
          )
          .subscribe((resData) => {
            const expirationDate = new Date(
              new Date().getTime() + +resData.expires_in * 1000
            );
            // const user = new User(
            //   res.user!.email!,
            //   res.user!.uid!,
            //   resData.id_token,
            //   expirationDate
            // );
            this.user$.next(true);
            this.autoLogout(+resData.expires_in * 1000);
            // localStorage.setItem('userData', JSON.stringify(user));
            this.router.navigate(['/main']);
          });
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  logOut() {
    return this.http.post(this.mongoDbBaseApiUrl + '/logout', {}).pipe(
      tap((res) => {
        localStorage.removeItem('userData');
        this.router.navigate(['/']);
        if (this.tokenExpirationTimer) {
          clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
      })
    );
  }

  verify() {
    return this.http.get(this.mongoDbBaseApiUrl + '/verify').pipe(
      catchError((err) => {
        this.user$.next(false);
        return of(null);
      }),
      map((res) => {
        this.user$.next(true);
        return res;
      })
    );
  }

  autoLogin() {
    this.router.navigate(['/main']);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }
}

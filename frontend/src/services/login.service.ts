import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import User from '../models/user.model';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, of, firstValueFrom, from } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Signup } from '../models/signup.model';
import { Login, LoginResponseData } from '../models/login.model';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

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
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(auth, provider)).pipe(
      switchMap((res) => {
        const user = res.user;

        const username = user.displayName ?? '';
        const fname = username?.split(' ')[0];
        const lname = username?.split(' ')[1];
        const email = user.email!;
        const photoUrl = user.photoURL ?? '';

        const signupRequest: Signup = {
          username,
          fname,
          lname,
          email,
          password: user.uid,
        };

        return this.google(signupRequest);
      }),
      catchError((err) => {
        console.error('Google sign-in error:', err);
        return throwError(() => err);
      })
    );
  }

  google(signupRequest: Signup) {
    return this.http
      .post<LoginResponseData>(
        this.mongoDbBaseApiUrl + '/google',
        signupRequest,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((res: LoginResponseData) => {
          this.autoLogout(res.ExpirationTime);
        }),
        map((res) => {
          return res.user;
        })
      );
  }

  logOut() {
    return this.http
      .post(this.mongoDbBaseApiUrl + '/logout', {}, { withCredentials: true })
      .pipe(
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
    return this.http
      .get(this.mongoDbBaseApiUrl + '/verify', { withCredentials: true })
      .pipe(
        tap({
          next: () => this.user$.next(true),
          error: () => this.user$.next(false),
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

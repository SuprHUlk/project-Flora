import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Letter, LetterResponseData } from '../models/letter.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LetterService {
  private readonly mongoDbBaseApiUrl: string =
    environment.baseApiUrl + '/letter';
  private letters$ = new BehaviorSubject<Letter[]>([]);
  constructor(private http: HttpClient) {
    this.received();
  }

  send(letter: Letter) {
    return this.http.post(this.mongoDbBaseApiUrl + '/send', letter, {
      withCredentials: true,
    });
  }

  reject(letter: Letter) {
    return this.http.post(this.mongoDbBaseApiUrl + '/reSend', letter, {
      withCredentials: true,
    });
  }

  getLetter$(): Observable<Letter[]> {
    return this.letters$.asObservable();
  }

  get() {
    return this.http
      .get<LetterResponseData>(this.mongoDbBaseApiUrl + '/get', {
        withCredentials: true,
      })
      .pipe(
        map((res: LetterResponseData) => {
          console.log(res);
          return res.letters;
        })
      );
  }

  received() {
    this.http
      .get<LetterResponseData>(this.mongoDbBaseApiUrl + '/received', {
        withCredentials: true,
      })
      .subscribe({
        next: (res: LetterResponseData) => {
          this.letters$.next(res.letters);
        },
        error: (err) => {
          console.log(err);
          this.letters$.error(err);
        },
      });
  }

  accept(letterRequest: Letter) {
    return this.http
      .post<LetterResponseData>(
        this.mongoDbBaseApiUrl + '/accept',
        letterRequest,
        {
          withCredentials: true,
        }
      )
      .pipe(map((res: LetterResponseData) => res.msg));
  }
}

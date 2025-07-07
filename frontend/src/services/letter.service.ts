import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Letter, LetterResponseData } from '../models/letter.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LetterService {
  private readonly mongoDbBaseApiUrl: string =
    environment.baseApiUrl + '/letter';
  constructor(private http: HttpClient) {}

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

  get() {
    return this.http
      .get<LetterResponseData>(this.mongoDbBaseApiUrl + '/get', {
        withCredentials: true,
      })
      .pipe(
        map((res: LetterResponseData) => {
          return res.letters;
        })
      );
  }

  received() {
    return this.http
      .get<LetterResponseData>(this.mongoDbBaseApiUrl + '/received', {
        withCredentials: true,
      })
      .pipe(
        map((res: LetterResponseData) => {
          return res.letters;
        })
      );
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

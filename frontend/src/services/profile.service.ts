import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import User, { Friend } from 'src/models/user.model';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly baseApiUrl = environment.baseApiUrl + '/profile';

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get(this.baseApiUrl + '/get', { withCredentials: true });
  }

  getFriends() {
    return this.http.get<Friend[]>(this.baseApiUrl + '/getFriends', {
      withCredentials: true,
    });
  }

  edit(profileData: FormData) {
    return this.http
      .post<{ msg: string }>(this.baseApiUrl + '/edit', profileData, {
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          return res.msg;
        })
      );
  }
}

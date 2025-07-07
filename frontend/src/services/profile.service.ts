import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Friend } from 'src/models/user.model';
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
}

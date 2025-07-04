import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { LoginService } from 'src/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.loginService.verify().pipe(
      map((res) => {
        console.log(res);
        return true;
      }),
      catchError(() => {
        this.loginService.logOut();
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}

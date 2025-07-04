import { Component } from '@angular/core';
import { Login } from '../../models/login.model';
import { Router } from '@angular/router';
import { NgForm, Validators } from '@angular/forms';
import { LoginService } from 'src/services/login.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [ReactiveFormsModule, NgbCarouselModule, RouterModule],
})
export class LoginPageComponent {
  images = ['assets/ok.jpg', 'assets/ok1.png', 'assets/r2.jpg'];
  errorMessage: any;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private loginService: LoginService) {}

  onSubmit() {
    if (!this.loginForm.valid) {
      alert('Please fill the form properly');
      return;
    }

    this.login();
  }

  login() {
    const data = this.loginForm.value;
    const loginData: Login = {
      email: data.email!,
      password: data.password!,
    };
    this.loginService.login(loginData).subscribe({
      next: (user) => {
        console.log(user);
        localStorage.setItem('userData', JSON.stringify(user));
      },
      error: (err) => {
        console.log(err);
        if (err.status == 404 || err.status == 400) {
          this.errorMessage = 'COMMON_ERROR';
        } else {
          this.errorMessage = 'UNKNOWN_ERROR';
        }
      },
      complete: () => {
        this.router.navigate(['/main']);
      },
    });
  }

  async signInWithGoogle() {
    this.loginService.googleSignIn().subscribe({
      next: (user) => {
        console.log(user);
        localStorage.setItem('userData', JSON.stringify(user));
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'UNKNOWN_ERROR';
      },
      complete: () => {
        this.router.navigate(['/main']);
      },
    });
  }
}

import { Component } from '@angular/core';
import { Login } from '../../models/login.model';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { LoginService } from 'src/services/login.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ToastService } from 'src/services/shared/toast.service';
import { Toast } from 'src/models/toast.model';

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

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastService
  ) {}

  onSubmit() {
    if (!this.loginForm.valid) {
      this.toastService.error({
        message: 'Please fill the form properly',
        autohide: true,
      });
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
        const toast: Toast = {
          message: '',
          autohide: true,
        };
        if (err.status == 404 || err.status == 400) {
          toast.message = 'Sorry, your email or password was incorrect.';
          this.toastService.error(toast);
        } else {
          toast.message = 'An unexpected error occurred!!';
          this.toastService.error(toast);
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
        this.toastService.error({
          message: 'Login unsuccessful: UNKNOWN_ERROR',
          autohide: true,
        });
      },
      complete: () => {
        this.toastService.show({
          message: 'Login successful: Enjoy!!!',
          autohide: true,
        });
        this.router.navigate(['/main']);
      },
    });
  }
}

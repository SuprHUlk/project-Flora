import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { Signup } from '../../models/signup.model';
import { ToastService } from 'src/services/shared/toast.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
  imports: [ReactiveFormsModule],
})
export class SignupPageComponent {
  errorMessage: string = '';

  signupForm = new FormGroup({
    fname: new FormControl('', [Validators.required]),
    lname: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rePassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit() {
    const password = this.signupForm.get('password')!.value;
    const rePassword = this.signupForm.get('rePassword')!.value;
    console.log();

    if (password != rePassword) {
      this.errorMessage = 'Password does not match';
      return;
    }

    if (!this.signupForm.valid) {
      this.toastService.error({
        message: 'Please fill the form',
        autohide: true,
      });
    }

    this.signup();
  }

  signup() {
    const data = this.signupForm.value;

    const signUp: Signup = {
      fname: data.fname!,
      lname: data.lname!,
      email: data.email!,
      password: data.password!,
      username: data.username!,
    };

    this.loginService.signup(signUp).subscribe({
      next: (res) => {
        console.log(res);
        this.toastService.show({
          message: 'Signup successful: Please login to continue',
          autohide: true,
        });
      },
      error: (err) => {
        console.log(err.error.errors);

        if (err.error.errors.email) {
          this.errorMessage = 'EMAIL_EXISTS';
        } else if (err.error.errors.username) {
          this.errorMessage = 'USERNAME_EXISTS';
        }
      },
      complete: () => {
        this.router.navigate(['/']);
      },
    });
  }
}

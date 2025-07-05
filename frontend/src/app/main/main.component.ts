import { Component } from '@angular/core';
import { LoginService } from 'src/services/login.service';

import User from 'src/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: false,
})
export class MainComponent {
  constructor(private loginService: LoginService) {}
  userDetails: User;
  userType: string = 'chat';
  img = '';
  onLogOut() {
    this.loginService.logOut().subscribe();
  }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('userData') ?? '{}');
  }
}

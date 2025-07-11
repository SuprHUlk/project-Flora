import { Component } from '@angular/core';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  constructor(private loginService: LoginService) {}

  title = 'project-flora';

  ngOnInit() {
    this.loginService.autoLogin();
  }
}

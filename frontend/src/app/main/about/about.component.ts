import { Component } from '@angular/core';
import User from 'src/models/user.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: false,
})
export class AboutComponent {
  constructor() {}

  loader = false;
  userData: User;
  ngOnInit() {
    // this.load();
    this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
  }
  load() {
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 1000);
  }
}

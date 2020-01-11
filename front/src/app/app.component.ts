import { Component } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front';
  loggedIn = false;
  constructor(private _user:UserService) {
    console.log('apc');
    _user.loginState$.subscribe(
      val => this.loggedIn = val
    )
  }
}

import { Component, AfterViewInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Ankete i testovi';
  loggedIn = false;
  username = "";
  constructor(private _user:UserService) {
    console.log('apc');
    _user.loginState$.subscribe(
      val => {
        console.log(this._user.userObj)
        this.username = this._user.userObj? this._user.userObj.username: "";
        this.loggedIn = val
      }
    )
  }

  ngAfterViewInit(){
   
  }
}

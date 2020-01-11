import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private _router: Router, private _user:UserService) { }

  ngOnInit() {
    this._user.logout().subscribe(data => {
      this._user.setLogin(false);
      this._router.navigate(['/login']);
    },
    err => {
      this._router.navigate(['/login']);
    });
  }

}

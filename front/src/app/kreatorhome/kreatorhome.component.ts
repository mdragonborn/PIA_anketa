import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kreatorhome',
  templateUrl: './kreatorhome.component.html',
  styleUrls: ['./kreatorhome.component.css']
})
export class KreatorhomeComponent implements OnInit {

  constructor(private _router: Router, private _user: UserService) {
    this._user.checkLogin();
   }

  ngOnInit() {
  }

}

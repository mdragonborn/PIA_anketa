import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-ispitanik-home',
  templateUrl: './ispitanik-home.component.html',
  styleUrls: ['./ispitanik-home.component.css']
})
export class IspitanikHomeComponent implements OnInit {

  constructor(private _user: UserService) {
    this._user.checkLogin();

   }

  ngOnInit() {
  }

}

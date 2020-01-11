import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-ispitanikhome',
  templateUrl: './ispitanikhome.component.html',
  styleUrls: ['./ispitanikhome.component.css']
})
export class IspitanikhomeComponent implements OnInit {

  constructor(private _user: UserService) {
    this._user.checkLogin();

   }

  ngOnInit() {
  }

}

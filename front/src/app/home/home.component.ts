import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _userService:UserService, private _router: Router) { 
    this._userService.user().subscribe(
      data => {},
      error => { console.log(error); this._router.navigate(['/login']); }
    )
  }

  ngOnInit() {
  }

}

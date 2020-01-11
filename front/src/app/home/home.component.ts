import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: Object;
  constructor(private _userService:UserService, private _router: Router) { 
    this._userService.user().subscribe(
      data => {
        console.log(data);
        this._userService.setLogin(true);
        if(data['kategorija'] === 'A') {
          this._router.navigate(['/admin']);
        } else if (data['kategorija'] === 'I') {
          this._router.navigate(['/isp']);
        }
        else if (data['kategorija'] === 'K') {
          this._router.navigate(['/kreator'])
        } else           this._router.navigate(['/isp']);

      },
      error => { console.log(error);
        this._userService.setLogin(false);
        this._router.navigate(['/login']); }
    )
  }

  ngOnInit() {
  }

}

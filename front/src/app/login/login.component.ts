import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message : string = "";
  loginForm : FormGroup=new FormGroup({
    username:new FormControl(null,Validators.required),
    password:new FormControl(null, Validators.required)
  });
  constructor(private _router:Router, private _user:UserService) { 
    this._user.user().subscribe(
      data => { console.log(data); this._router.navigate(['/home']); }
    )
  }

  ngOnInit() {
  }

  moveToRegister(){
    this._router.navigate(['/register']);
  }

  login(){
    if(!this.loginForm.valid){
      console.log('Invalid');return;
    }

    console.log(JSON.stringify(this.loginForm.value));
    this._user.login(JSON.stringify(this.loginForm.value))
    .subscribe(data => {
      if (data['message']==="Login Success") {
        this._user.setLogin(true);
        this._router.navigate(['/home']);
      }
      else {
        this.message=data['message'];
      }
  },
  error => {    
    console.log(error);  
    this.message=error;
  });
  }

}
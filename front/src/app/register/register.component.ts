import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm : FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.email,Validators.required]),
    ime: new FormControl(null, Validators.required),
    prezime:new FormControl(null, Validators.required),
    username:new FormControl(null, Validators.required),
    jmbg:new FormControl(null, Validators.required),
    password:new FormControl(null, Validators.required),
    passwordConfirm:new FormControl(null, Validators.required)
  });
  constructor(private _router:Router,
    private _userService:UserService ) { 
      this._userService.user().subscribe(
        data => { this._router.navigate(['/home']); }
      )
    }

  ngOnInit() {
  }

  moveToRegister(){
    this._router.navigate(['/register']);
  }

  register(){
    //if(!this.registerForm.valid || this.registerForm.controls.password!==this.registerForm.controls.passwordConfirm){
    //  console.log('Invalid');//return;
    //}

    this._userService.register(JSON.stringify(this.registerForm.value))
    .subscribe(
      data=> {console.log(data); this._router.navigate(['/register']);},
      error=>console.error(error)
    );
    console.log(JSON.stringify(this.registerForm.value));

  }

}
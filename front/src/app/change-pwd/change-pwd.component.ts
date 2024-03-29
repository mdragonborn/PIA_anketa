import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.css']
})
export class ChangePwdComponent implements OnInit {

  errorMsg: string;
  registerForm : FormGroup=new FormGroup({
    password:new FormControl(null, [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")]),
    reppassword: new FormControl(null, Validators.required),
    oldpassword: new FormControl(null, Validators.required),
  });

  constructor(private _userService:UserService,
    private _router:Router) { 
      this._userService.checkLogin();
  }

  ngOnInit() {
  }

  submit() {
    if(!this.registerForm.get("password").valid) {
      this.errorMsg = "Lozinka nije dovoljno jaka. Mora da sadrzi kombinaciju malih i velikih slova, brojeva i znakova.";
      return;
    }
    if(!this.registerForm.valid  
      || this.registerForm.get("password").value!==this.registerForm.get("reppassword").value){
        this.errorMsg = "Lozinke se ne poklapaju.";
        return;
    }

    this._userService.change(JSON.stringify(this.registerForm.value))
    .subscribe(
      data=> { console.log(data); this._router.navigate(['/login']); },
      error=>{ this.errorMsg = error; console.error(error); }
    );
  }

}

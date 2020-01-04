import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { EmitterVisitorContext } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  errorMsg: string;
  captcha: string;
  canvas: HTMLCanvasElement;
  registerForm : FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.email,Validators.required]),
    ime: new FormControl(null, Validators.required),
    prezime:new FormControl(null, Validators.required),
    username:new FormControl(null, Validators.required),
    jmbg:new FormControl(null, Validators.required),
    password:new FormControl(null, Validators.required),
    passwordConfirm:new FormControl(null, Validators.required),
    captcha: new FormControl(null, Validators.required),
  });
  constructor(private _router:Router,
    private _userService:UserService ) { 
      this._userService.user().subscribe(
        data => { this._router.navigate(['/home']); }
      )

      this._userService.captcha().subscribe(
        data => {
          this.captcha = data["captcha"];
          this.canvas = document.getElementById("canv") as HTMLCanvasElement;
          let ctx = this.canvas.getContext("2d");
          this.canvas.width  = 75;
          this.canvas.height = 30;
          ctx.font = "15px Verdana";
          ctx.fillText(this.captcha, 10, 15);
          
        }
      )
    }

  ngOnInit() {
  }

  moveToRegister(){
    this._router.navigate(['/register']);
  }

  register(){
    this.errorMsg = '';
    if(!this.registerForm.valid  
      || this.registerForm.get("password").value!==this.registerForm.get("passwordConfirm").value){
      this.errorMsg = 'Invalid fields';
      console.log('Invalid');
      return;
    }

    if(this.registerForm.get('captcha').value !== this.captcha) {
      this.errorMsg = 'Captcha error';
      this._userService.captcha().subscribe(
        data => {
          this.captcha = data["captcha"];
          this.canvas = document.getElementById("canv") as HTMLCanvasElement;
          let ctx = this.canvas.getContext("2d");
          this.canvas.width  = 75;
          this.canvas.height = 30;
          ctx.font = "15px Verdana";
          ctx.fillText(this.captcha, 10, 15);
        }
      )
      console.log("captcha error");
      return;
    }    

    this._userService.register(JSON.stringify(this.registerForm.value))
    .subscribe(
      data=> {console.log(data); this._router.navigate(['/register']);},
      error=>console.error(error)
    );
    console.log(JSON.stringify(this.registerForm.value));

  }

}
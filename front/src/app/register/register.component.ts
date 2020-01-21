import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { EmitterVisitorContext } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {

  errorMsg: string;
  captcha: string;
  canvas: HTMLCanvasElement;
  @Input()_admin?:Boolean;
  displayKategorija:string = "hidden";
  @ViewChild('canv', {static:false}) canvasElement: ElementRef;

  registerForm : FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.email,Validators.required]),
    ime: new FormControl(null, Validators.required),
    prezime:new FormControl(null, Validators.required),
    username:new FormControl(null, Validators.required),
    jmbg:new FormControl(null, Validators.required),
    password:new FormControl(null, [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")]),
    passwordConfirm:new FormControl(null, Validators.required),
    kategorija: new FormControl('I', [Validators.pattern("I|K|A")]),
    captcha: new FormControl(null, Validators.required),
  });
  constructor(private _router:Router,
    private _userService:UserService) { 
    }

  ngAfterViewInit() {
    if(!this._admin){
      console.log("admin");
      this._userService.user().subscribe(
        data => { this._router.navigate(['/home']); }
      )
    }
    else{
      this.registerForm.addControl("odobren", new FormControl(true));
    }

    this._userService.captcha().subscribe(
      data => {
        this.captcha = data["captcha"];
        this.canvas = this.canvasElement.nativeElement as HTMLCanvasElement;
        let ctx = this.canvas.getContext("2d");
        this.canvas.width  = 75;
        this.canvas.height = 30;
        ctx.font = "15px Verdana";
        ctx.fillText(this.captcha, 10, 15);
        
      }
    )
  }

  moveToRegister(){
    this._router.navigate(['/register']);
  }

  register(){
    this.errorMsg = '';
    if(!this.registerForm.get("password").valid) {
      console.log(this.registerForm.get("password"))
      this.errorMsg = "Lozinka nije dovoljno jaka. Mora da bude duze od 8 karaktera i  sadrzi kombinaciju malih i velikih slova, brojeva i znakova.";
      return;
    }
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
          this.canvas = this.canvasElement.nativeElement as HTMLCanvasElement;
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
      data=> {console.log(data); 
        if(!this._admin) {
          this._router.navigate(['/login']);
        } else {
          this._router.navigate(['/admin']);
        }
      },
      error=>{
        if(error.status===400) {
          this.errorMsg = "Vec postoji korisnik sa tim korisnickim imenom."
        }
        console.error(error)
      }
    );
    console.log(JSON.stringify(this.registerForm.value));

  }

}
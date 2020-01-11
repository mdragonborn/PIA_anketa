import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loginStateSource = new Subject<boolean>();
  loginState$ = this.loginStateSource.asObservable();

  constructor(private _http:HttpClient) { }

  setLogin(value: boolean) {
    this.loginStateSource.next(value);
  }

  register(body:any) {
    return this._http.post("http://127.0.0.1:3000/users/register",body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  login(body:any) {
    return this._http.post("http://127.0.0.1:3000/users/login",body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  change(body:any) {
    return this._http.post("http://127.0.0.1:3000/users/change",body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  user() {
    return this._http.get("http://127.0.0.1:3000/users/user", {
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  logout() {
    return this._http.get("http://127.0.0.1:3000/users/logout", {
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    })
  }

  captcha() {
    return this._http.get("http://127.0.0.1:3000/captcha",{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  requests() {
    return this._http.get("http://127.0.0.1:3000/users/requests",{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  confirm(username: string) {
    return this._http.get("http://127.0.0.1:3000/users/confirm/"+username,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  reject(username: string) {
    return this._http.get("http://127.0.0.1:3000/users/reject/"+username,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }
}

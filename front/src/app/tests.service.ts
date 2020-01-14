import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestsService {

  saved = null;
  constructor(private _http: HttpClient) {}

  newTest(data) {
    return this._http.post("http://127.0.0.1:3000/tests/new", data,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getTestsByCreator() {
    return this._http.get("http://127.0.0.1:3000/tests/created",{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getAvailable() {
    return this._http.get("http://127.0.0.1:3000/tests/available",{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  setSaved(test) {
    this.saved=test;
  }

  getTestById(id) {
    return this._http.post("http://127.0.0.1:3000/tests/get", {id},{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getSaved(){
    return this.saved;
  }
}

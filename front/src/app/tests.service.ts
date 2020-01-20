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

  getResponse(testId, username) {
    return this._http.post("http://127.0.0.1:3000/tests/getresponse", {id:testId, username},{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getTestById(id) {
    return this._http.post("http://127.0.0.1:3000/tests/get", {id},{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  
  startTest(_id) {
    return this._http.post("http://127.0.0.1:3000/tests/start", {_id},{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  saveResponse(response) {
    return this._http.post("http://127.0.0.1:3000/tests/saveresponse", {response},{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  setSaved(test) {
    this.saved=test;
  }

  getSaved(){
    return this.saved;
  }

  getReportAndResponses(testId) {
    return this._http.post("http://127.0.0.1:3000/tests/report", {testId},{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  fullResponse(testId, username){
    return this._http.post("http://127.0.0.1:3000/tests/fullResponse", {testId, username},{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}

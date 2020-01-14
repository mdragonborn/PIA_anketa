import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestsService } from '../tests.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  testId: Number;
  testForm: any;
  response: any;
  started = false;
  errorMsgStart: string;
  loaded= false;

  constructor(private _route: ActivatedRoute, private _router: Router,
    private _tests: TestsService) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.testId = +params['id'];
      let temp = this._tests.getSaved();
      if(temp && temp['id']===this.testId){
        this.testForm = temp;
        this.getResponse();
      }
      else {
        this._tests.getTestById(this.testId).subscribe(data => {
          console.log(data);
          this.testForm = data;
          this.getResponse();
        },
        err => {
          console.log(err);
        });
      }
    });
  }

  getResponse() {
    this._tests.getResponse(this.testId).subscribe(data => {
      console.log(data);
      this.response = data;
      if(this.response.beginning) this.started = true;
      this.loaded = true;
    }, err =>{
      this.loaded = true;
    })
  }

  type() {
    if(this.testForm.type==='A') return 'Anketa'
    else return 'Test'
  }

  typePrompt() {
    if(this.testForm.type==='A') return 'ankete'
    else return 'testa'
  }

  startTest() {
    if(new Date(this.testForm.end)<=new Date()) {
      this.errorMsgStart = "Cannot start test due to time constraints."
    }
    this._tests.startTest(this.response._id).subscribe(
      data=> {
        this.response = data;
        this.started = true;
      },
      err => {
        this.errorMsgStart = "Error"
      }
    );
  }

}

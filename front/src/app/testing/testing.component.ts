import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestsService } from '../tests.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event) {
    $event.returnValue='Your data will be lost!';
  }
  testId: Number;
  testInfo: any;
  response: any;
  started = false;
  errorMsgStart: string;
  loaded= false;
  endTime = new Date();

  constructor(private _route: ActivatedRoute, private _router: Router,
    private _tests: TestsService, private _user: UserService) {
      this.finished = this.finished.bind(this);
      _user.checkLogin()
    }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.testId = +params['id'];
      let temp = this._tests.getSaved();
      if(temp && temp['id']===this.testId){
        this.testInfo = temp;
        this.getResponse();
      }
      else {
        this._tests.getTestById(this.testId).subscribe(data => {
          console.log(data);
          this.testInfo = data;
          this.getResponse();
        },
        err => {
          console.log(err);
        });
      }
    });
  }

  ngOnDestroy() {
    if(this.response && this.response.beginning && !this.response.finished){
      if(window.confirm('Da li zelite da sacuvate vase odgovore?')){
        this._tests.saveResponse(this.response).subscribe();
      }
    }
  }

  getResponse() {
    this._tests.getResponse(this.testId).subscribe(data => {
      this.response = data;
      if(this.response.beginning) this.started = true;
      if(this.response.end) {
        this.endTime = new Date(this.response.end);
      }
      this.loaded = true;
    }, err =>{
      this.loaded = true;
    })
  }

  type() {
    if(this.testInfo.type==='A') return 'Anketa'
    else return 'Test'
  }

  typePrompt() {
    if(this.testInfo.type==='A') return 'ankete'
    else return 'testa'
  }

  startTest() {
    if(new Date(this.testInfo.end)<=new Date()) {
      this.errorMsgStart = "Cannot start test due to time constraints."
    }
    this._tests.startTest(this.response._id).subscribe(
      data=> {
        this.response = data;
        this.endTime = new Date(this.response.end);
        this.started = true;
      },
      err => {
        this.errorMsgStart = "Error"
      }
    );
  }

  save(){
    console.log(this.response);
    this._tests.saveResponse(this.response).subscribe(
      data => {
        this.errorMsgStart = "Odgovori sačuvani na serveru."
      },
      err => {
        console.log(err);
        this.errorMsgStart = err.message;
      }
    );
  }

  submit(){
    console.log(this.response);
    this.response.finished = true;
    this._tests.saveResponse(this.response).subscribe(
      data => {
        console.log(data)
        let message = "Odgovori sacuvani na sereveru i test zavrsen.";
        if(this.testInfo.type==='T'){
          message += "\nRezultat testa " + data['score'] + "/" + this.testInfo.maxScore + " poena."
        }
        alert(message);
        this._router.navigate(['/home']);
      },
      err => {
        console.log(err)
        this.errorMsgStart = err.message;
      }
    );
  }

  finished() {
    if(!this.response.finished){
      this.submit();
    } else {
      this._router.navigate(['/home']);
    }
  }

}

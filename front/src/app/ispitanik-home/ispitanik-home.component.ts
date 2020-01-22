import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { TestsService } from '../tests.service';

@Component({
  selector: 'app-ispitanik-home',
  templateUrl: './ispitanik-home.component.html',
  styleUrls: ['./ispitanik-home.component.css']
})
export class IspitanikHomeComponent implements OnInit {

  tests: Array<any>;
  loading = true;
  odobren = false;
  constructor(private _user: UserService,
    private _tests: TestsService,
    private _router: Router) {
    this._user.checkLogin(() => {
      this.odobren = this._user.userObj.odobren;
    });
    this._tests.getAvailable().subscribe(
      data => {
        console.log(data);
        this.tests = data as Array<any>;
        this.loading = false;
      }
    )
   }

  ngOnInit() {
  }

  type(type){
    return type==='A'?'Anketa':'Test';
  }

  questionCount(test) {
    return test.questions.length;
  }

  available(info) {
    // Vremenska zona
    return (new Date(info.test.end)>new Date()) && !info.finished;
  }

  start(t) {
    this._tests.setSaved(t.test);
    this._router.navigate(['/testing', t.test.id]);
  }

  viewResponse(t) {
    this._tests.setSaved(t.test);
    this._router.navigate(['/testing', t.test.id]);
  }

  dateString(dateStr) {
    return new Date(dateStr).toLocaleString()
  }

}

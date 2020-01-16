import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { TestsService } from '../tests.service';

@Component({
  selector: 'app-kreator-home',
  templateUrl: './kreator-home.component.html',
  styleUrls: ['./kreator-home.component.css']
})
export class KreatorHomeComponent implements OnInit {
  myTests: Array<any>;
  loading = true;

  constructor(private _router: Router, private _user: UserService,
    private _tests: TestsService) {
    this._user.checkLogin();

    this._tests.getTestsByCreator().subscribe(
      data => {
        console.log(data)
        this.myTests = data as Array<any>;
        for(let t of this.myTests) {
          t['begin'] = new Date(t['begin']).toLocaleString();
          t['end'] = new Date(t['end']).toLocaleString();
        }
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

  details(test) {
    this._tests.setSaved(test);
    this._router.navigate(['kreator/details/'+test.id]);
  }

}

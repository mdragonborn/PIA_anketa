import { Component, OnInit } from '@angular/core';
import { TestsService } from '../tests.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css']
})
export class TestDetailsComponent implements OnInit {

  testId: Number;
  test = null;
  constructor(private _tests: TestsService, private _route: ActivatedRoute) {
    this.test = this._tests.getSaved();
    // TODO get answers and stats
   }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.testId = +params['id'];
      this._tests.getReportAndResponses(this.testId).subscribe(
        data => { console.log(data) },
        err => {console.log(err)})
    });
  }

}

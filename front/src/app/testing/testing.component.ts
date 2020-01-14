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
  constructor(private _route: ActivatedRoute, private _router: Router,
    private _tests: TestsService) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.testId = +params['id'];
      let temp = this._tests.getSaved();
      if(temp && temp['id']===this.testId){
        this.testForm = temp;
      }
      else {
        this._tests.getTestById(this.testId).subscribe(data => {
          console.log(data);
          this.testForm = data;
        },
        err => {
          console.log(err);
        });
      }
    });
  }

}

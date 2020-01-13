import { Component, OnInit } from '@angular/core';
import { TestsService } from '../tests.service';

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css']
})
export class TestDetailsComponent implements OnInit {

  constructor(private _tests: TestsService) {
    console.log(this._tests.getSaved());
    // TODO get answers and stats
   }

  ngOnInit() {
  }

}

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
  responsesInfo: any;
  report: any;
  loaded = false;
  scoresData: Array<any> = [];
  constructor(private _tests: TestsService, private _route: ActivatedRoute,
    private _router: Router) {
    this.test = this._tests.getSaved();
   }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.testId = +params['id'];
      this._tests.getReportAndResponses(this.testId).subscribe(
        data => { 
          this.responsesInfo = data['responsesInfo'];
          this.report = data['report'];
          if(!this.test) this.test = data['test'];

          this.scoresData = this.report.scores.map((d,i) => {
            return {
              "name": (i===0?i:(i*10+1))+' - '+((i+1)*10)+'%',
              "value": d
            }
          })
          this.loaded = true;
          console.log(data) 
        },
        err => {console.log(err)})
    });
  }

  anketa(){
    return this.test && this.test.type==='A'
  }

  maxScore(){
    return this.test.maxScore
  }

  viewMore(response) {
    this._router.navigate(['/testing' + '/'+ this.test.id +'/'+ response.username])
  }

  responsesLen() {
    return this.responsesInfo && this.responsesInfo.length!==0;
  }

  beginTime() {
    if(this.test)
    return new Date(this.test.begin).toLocaleString();
  }

  endTime() {
    if(this.test)
    return new Date(this.test.end).toLocaleString()
  }
}

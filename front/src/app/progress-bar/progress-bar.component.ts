import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {CountdownComponent} from 'ngx-countdown';
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit, AfterViewChecked {

  @Input() endTime: Date;
  @Input() answers: Array<any>
  @Input() finishedCallback: Function;
  config = 0;
  completed = 0;
  total = 0;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log(this.endTime)
    let now = new Date()
    console.log(now)
    this.config = (this.endTime.getTime() - new Date().getTime())/1000;
    console.log(this.config);
    if(this.config<0) this.config = 0;
  }

  amountCompleted() {
    if(!this.answers) return 0;
    this.completed = 0;
    this.total = this.answers.length;
    for(let answer of this.answers) {
      for(let field of answer) {
        if(field!==null && field!==''){
          this.completed++;
          break;
        }
      }
    }
    return this.completed;
  }
  

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }
  

  finish($event) {
    if($event.action==="done"){
      this.finishedCallback();
      console.log('finished');
    }
  }

}

import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-question-stat-chart',
  templateUrl: './question-stat-chart.component.html',
  styleUrls: ['./question-stat-chart.component.css']
})
export class QuestionStatChartComponent implements OnInit, AfterViewInit {
  @Input() question: any;
  @Input() reportQuestion: any; //report.question[i]
  @ViewChild("maindiv", {static: true}) mainDiv: ElementRef;
  colorScheme = {
    domain: ['#1976d2',  '#c1666b', '#d4b483', '#e4dfda', '#48a9a6']
  };
  results: Array<any> = [];

  view = [300, 200]
  label = 'Ukupno odgovora'
  constructor() { }

  ngOnInit() {
    switch(this.question.type) {
      case 1:
      case 2:
        if(this.question.ordered) {
          this.results = this.reportQuestion.answerFields.map(field => {
            return field.answers.map(answer => {
              return {
                name: answer.content,
                value: answer.occurrences
              }
            })
          })
        }
        else {
          this.results = this.reportQuestion.answerFields.map(field => {
            return field.answers.map(answer => {
              return {
                name: answer.content,
                value: answer.occurrences
              }
            })
          }).flat();
        }
        break;
      case 4:
      case 5:
        this.results = this.reportQuestion.answerFields.map(field => {
          return {
            name: field.extraInfo,
            value: field.answers[0].occurrences
          }
        })
        break;
    }
  }

  ngAfterViewInit() {
    if((this.question.type===1 || this.question.type===2) && this.question.ordered){
      let h = this.results.length*220;
      this.mainDiv.nativeElement.setAttribute('style','min-height: '+h+ 'px;');
    }
  }
}

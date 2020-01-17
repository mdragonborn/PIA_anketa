import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-score-bar-chart',
  templateUrl: './score-bar-chart.component.html',
  styleUrls: ['./score-bar-chart.component.css']
})
export class ScoreBarChartComponent {

  @Input() scoreData: Array<any>
  data: Array<any>;

  view: any[] = [400, 250];

  // options
  showXAxis = true;
  showYAxis = true;

  colorScheme = {
    domain: ['#1976d2', '#48a9a6', '#e4dfda', '#d4b483', '#c1666b']
  };

  constructor() { }

}

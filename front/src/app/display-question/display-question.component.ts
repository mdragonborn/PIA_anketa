import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-question',
  templateUrl: './display-question.component.html',
  styleUrls: ['./display-question.component.css']
})
export class DisplayQuestionComponent implements OnInit {

  @Input() question: any;
  @Input() answers: Array<any> = [];
  @Input() index: Number;
  @Input() disabled: boolean = false;
  @Input() classes: string = "";

  constructor() { }

  ngOnInit() {}

  radioChecked(id){
    for(let i = 0; i <  this.answers.length; i++){
      if(i !== id){ 
        this.answers[i] = false;
      }else{
        this.answers[i] = true;
      } 
    }
  }

}

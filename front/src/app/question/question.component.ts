import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  @Input() group: FormGroup;
  // @Output() controlNameChange = new EventEmitter<>();
  constructor() {}

  ngOnInit() {
  }

  questionType() {
    return this.group.get('type').value;
  }

  answerFields() {
    return this.group.get('answerFields').value;
  }

}

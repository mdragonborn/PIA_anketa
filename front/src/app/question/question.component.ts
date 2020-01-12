import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
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

  add() {
    let formGroup;
    switch(this.questionType()) {
      case 1: 
        formGroup = new FormGroup({
          type: new FormControl('number'),
          extraInfo: new FormControl(null, Validators.required),
          answer: new FormControl(null, Validators.required)
        });
        break;
      case 2:
        formGroup = new FormGroup({
          type: new FormControl('string'),
          extraInfo: new FormControl(null, Validators.required),
          answer: new FormControl(null, Validators.required)
        });
        break;
      case 3:
        formGroup = new FormGroup({
          type: new FormControl('text'),
          answer: new FormControl(null, Validators.required)
        });
        break;
      case 4:
        formGroup = new FormGroup({
          type: new FormControl('radio'),
          extraInfo: new FormControl(null, Validators.required),
          answer: new FormControl(true, Validators.required)
        });
        break;
      case 5:
        formGroup = new FormGroup({
          type: new FormControl('checkbox'),
          extraInfo: new FormControl(null, Validators.required),
          answer: new FormControl(null, Validators.required)
        });
      break;
    }

    (<FormArray>this.group.get('answerFields')).push(formGroup);
  }

  remove(i){
    if ((<FormArray>this.group.get('answerFields')).at(i).get('answer').value &&
    (<FormArray>this.group.get('answerFields')).at(i).get('answer').value!==""){
      if(window.confirm("Da li zelite da obrisete polje sa odgovorom?")){
        (<FormArray>this.group.get('answerFields')).removeAt(i);
      }
    }
    else {
      (<FormArray>this.group.get('answerFields')).removeAt(i);
    }

  }

}

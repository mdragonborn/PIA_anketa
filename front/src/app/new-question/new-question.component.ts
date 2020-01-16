import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.css']
})
export class NewQuestionComponent implements OnInit {

  @Input() group: FormGroup;
  rbAnswers = [];
  questionTypes = { 1: 'number', 2: 'string', 3: 'text', 4: 'radio', 5: 'checkbox'};
  @Input() testType: string;
  constructor() {}

  ngOnInit() {
    if(this.questionType()===4){
      this.rbAnswers.push(true);
    }
  }

  test() {
    return this.testType==='T';
  }

  trackByFn(index, item) {
    return index;
  }

  questionType() {
    return this.group.get('type').value;
  }

  answerFields() {
    return this.group.get('answerFields').value;
  }

  add() {
    let formGroup;
    if(this.questionType()<=3){
      formGroup = new FormGroup({
        type: new FormControl(this.questionTypes[this.questionType()]),
        extraInfo: new FormControl(null),
        answer: new FormControl(null, Validators.required)
      });
    } else {
      formGroup = new FormGroup({
        type: new FormControl(this.questionTypes[this.questionType()]),
        extraInfo: new FormControl(null, Validators.required),
        answer: new FormControl(false, Validators.required)
      });
    }

    if(this.questionType()===4) this.rbAnswers.push(false);

    (<FormArray>this.group.get('answerFields')).push(formGroup);
  }

  remove(i){
    if ((<FormArray>this.group.get('answerFields')).at(i).get('answer').value &&
    (<FormArray>this.group.get('answerFields')).at(i).get('answer').value!==""){
      if(window.confirm("Da li zelite da obrisete polje sa odgovorom?")){
        (<FormArray>this.group.get('answerFields')).removeAt(i);
        if(this.questionType()===4) {
          if(this.rbAnswers[i]) this.rbAnswers[i-1] = true;
          this.rbAnswers.splice(i, 1);
        }
      }
    }
    else {
      (<FormArray>this.group.get('answerFields')).removeAt(i);
      if(this.questionType()===4) {
        if(this.rbAnswers[i]) this.rbAnswers[i-1] = true;
        this.rbAnswers.splice(i, 1);
      }
    }

  }

  radioChecked(id){
    let size = (<FormArray>this.group.get('answerFields')).length;
    for(let i = 0; i <  this.rbAnswers.length; i++){
      if(i !== id){ 
        (<FormArray>this.group.get('answerFields')).at(i).get('answer').setValue(false);
        this.rbAnswers[i] = false;
      }else{
        (<FormArray>this.group.get('answerFields')).at(i).get('answer').setValue(true);
        this.rbAnswers[i] = true;
      } 
    }
  }

}

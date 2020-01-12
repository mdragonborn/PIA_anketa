import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-newtest',
  templateUrl: './newtest.component.html',
  styleUrls: ['./newtest.component.css']
})
export class NewtestComponent implements OnInit {

  baseForm : FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    type: new FormControl('A', [Validators.required, Validators.pattern('A|T')]),
    info: new FormControl(null),
    begin: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
    duration: new FormControl(null),
  });
  questions : Array<FormGroup> = [];
  selectedType = 1;
  @ViewChild('newquestionprompt', {static:false}) qPrompt: ElementRef;

  constructor(private renderer: Renderer2, private _user: UserService) { 
    this._user.checkLogin();
  }

  ngOnInit() {
  }

  addQuestion() {
    this.renderer.setProperty(this.qPrompt.nativeElement, 'style', 'display:block;');
  }

  ngOnChange() {}

  confirmNewQuestion() {
    let formGroup;
    switch(this.selectedType) {
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
    let newGroup = new FormGroup({question: new FormControl(null, Validators.required), 
      type: new FormControl(this.selectedType, Validators.required),
      answerFields: new FormArray([formGroup])});
    this.questions.push(newGroup);
    this.renderer.setProperty(this.qPrompt.nativeElement, 'style', 'display:none');
    return false;
  }

  removeQuestion(i){
    if(this.questions[i]){
      if(window.confirm("Da li ste sigurni da zelite da obrisete pitanje?")){
        this.questions.splice(i, 1);
      }
    }
  }

}

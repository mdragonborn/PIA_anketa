import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserService } from '../user.service';
import { TestsService } from '../tests.service';
import { Router } from '@angular/router';

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
    durationMin: new FormControl(null),
  });
  questions : Array<FormGroup> = [];
  questionTypes = { 1: 'number', 2: 'string', 3: 'text', 4: 'radio', 5: 'checkbox'};
  selectedType = 1;
  errorMsg: String = "";
  @ViewChild('newquestionprompt', {static:false}) qPrompt: ElementRef;

  constructor(private renderer: Renderer2, private _user: UserService,
    private _test: TestsService, private _router: Router) { 
    this._user.checkLogin();
  }

  ngOnInit() {
    let date = new Date();
    date.setHours(date.getHours()+1);
    this.baseForm.get('begin').setValue(date.toISOString().substring(0,19));
    date.setDate(date.getDate()+1);
    this.baseForm.get('end').setValue(date.toISOString().substring(0,19));
  }

  addQuestion() {
    this.renderer.setProperty(this.qPrompt.nativeElement, 'style', 'display:block;');
  }

  ngOnChange() {}

  confirmNewQuestion() {
    let formGroup = new FormGroup({
      type: new FormControl(this.questionTypes[this.selectedType]),
      extraInfo: new FormControl(null),
      answer: new FormControl(null)
    });
    if(this.selectedType>3){
      formGroup.get('extraInfo').setValidators([Validators.required]);
    }
    if(this.selectedType!==3) formGroup.controls['answer'].setValidators([Validators.required]);
    if(this.selectedType===5) formGroup.controls['answer'].setValue(false);
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
  
  submit() {

    // if(!this.baseForm.valid) {
    //   this.errorMsg = "Nedostaju obavezna polja."
    //   return;
    // }

    if(this.questions.length===0) {
      this.errorMsg = (this.baseForm.get('type').value==='A'?"Anketa":"Test")+" mora da ima barem jedno pitanje."
      return;
    }

    let invalid = false;
    this.errorMsg = "";
    let i = 0;
    for(let q of this.questions){
      if(this.baseForm.get('type').value==='A'){
        let size = (<FormArray>q.get('answerFields')).length;
        for(let j=0; j<size; j++){
          (<FormGroup>(<FormArray>q.get('answerFields')).at(j)).controls['answer'].setValidators([]);
          (<FormGroup>(<FormArray>q.get('answerFields')).at(j)).controls['answer'].updateValueAndValidity();
          console.log((<FormGroup>(<FormArray>q.get('answerFields')).at(j)).controls['answer'].errors);
        }
      }
      console.log(q);
      if(!q.valid) {
        invalid = true;
        this.errorMsg += "Nedostaju obavezna polja u pitanju br. "+i+"\n";
      }
      i++;
    }
    if(invalid) return;

    let data = this.baseForm.value;
    data['questions'] = []
    for(let q of this.questions) {
      data['questions'].push(q.value);
    }

    this._test.newTest(this.baseForm.value).subscribe(
      data => {
        console.log(data);
        this._router.navigate(['/..']);
      },
      err => {
        console.log(err)
        if(err.status===400) this.errorMsg = "Nedostaju obavezna polja."
        else this.errorMsg = err.message;
      }
    )
  }

}

import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserService } from '../user.service';
import { TestsService } from '../tests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newtest',
  templateUrl: './new-test.component.html',
  styleUrls: ['./new-test.component.css']
})
export class NewTestComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event) {
    if(this.saved) return;
    $event.returnValue='Your data will be lost!';
  }

  baseForm : FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    type: new FormControl('A', [Validators.required, Validators.pattern('A|T')]),
    info: new FormControl(null),
    anon: new FormControl(false),
    begin: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
    durationMin: new FormControl(null, Validators.required),
  });
  questions : Array<FormGroup> = [];
  questionTypes = { 1: 'number', 2: 'string', 3: 'text', 4: 'radio', 5: 'checkbox'};
  selectedType = 1;
  errorMsg: String = "";
  showSearch = false;
  searchQuery: String = "";
  searchResults: Array<any> = [];
  saved = false;
  touched = false;
  ranSearch = false;
  
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

  ngOnDestroy() {
    if(!this.saved && this.touched)
      if(window.confirm('Da li zelite da sacuvate napravljeni test/anketu?')){
        this.submit();
      }
  }

  addQuestion() {
    console.log(this.baseForm)
    this.touched = true;
    this.renderer.setProperty(this.qPrompt.nativeElement, 'style', 'display:block;');
  }

  runSearch() {
    this._test.search(this.searchQuery).subscribe(
      data => {
        this.searchResults = data as Array<any>;
        this.ranSearch = true;
      }
    )
  }

selectQuestionToAdd(q) {
  let answerFields = []
  for(let a of q.answerFields){
    let answerFormGroup = new FormGroup({
      type: new FormControl(a.type),
      extraInfo: new FormControl(a.extraInfo),
      answer: new FormControl(a.answer),
    });
    answerFields.push(answerFormGroup);
  }
  let questionGroup = new FormGroup({
    question: new FormControl(q.question, Validators.required), 
    id: new FormControl(q.id),
    type: new FormControl(q.type, Validators.required),
    weight: new FormControl(q.weight),
    ordered: new FormControl(q.ordered),
    answerFields: new FormArray(answerFields)});

    this.questions.push(questionGroup);

 this.cancelSearch()
}

cancelSearch() {
  this.showSearch = false;
  this.searchQuery = "";
  this.searchResults = [];
  this.ranSearch = false;
}

  ngOnChange() {}

  confirmNewQuestion() {
    if(this.selectedType===6) {
      this.showSearch = true;
      this.renderer.setProperty(this.qPrompt.nativeElement, 'style', 'display:none');
      return;
    }
    let answerFormGroup = new FormGroup({
      type: new FormControl(this.questionTypes[this.selectedType]),
      extraInfo: new FormControl(null),
      answer: new FormControl(null),
    });
    if(this.selectedType>3){
      answerFormGroup.get('extraInfo').setValidators([Validators.required]);
    }
    if(this.selectedType!==3) answerFormGroup.controls['answer'].setValidators([Validators.required]);
    if(this.selectedType===5) answerFormGroup.controls['answer'].setValue(false);
    if(this.selectedType===4) answerFormGroup.controls['answer'].setValue(true);
    let questionGroup = new FormGroup({question: new FormControl(null, Validators.required), 
      type: new FormControl(this.selectedType, Validators.required),
      weight: new FormControl(1),
      ordered: new FormControl(false),
      answerFields: new FormArray([answerFormGroup])});
    this.questions.push(questionGroup);
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

    if(!this.baseForm.valid) {
      this.errorMsg = "Nedostaju obavezna polja."
      return;
    }

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

    if(this.baseForm.get('type').value==='T'){
      this.baseForm.get('anon').setValue(null);
    }

    console.log(this.baseForm)

    if(invalid) return;

    let data = this.baseForm.value;
    data['questions'] = this.questions.map(q => q.value);

    this._test.newTest(this.baseForm.value).subscribe(
      data => {
        console.log(data);
        this.saved = true;
        this._router.navigate(['/kreator']);
      },
      err => {
        console.log(err)
        if(err.status===400) this.errorMsg = "Nedostaju obavezna polja."
        else this.errorMsg = err.message;
      }
    )
  }

}

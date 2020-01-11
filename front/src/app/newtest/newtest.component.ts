import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  addQuestion() {
    this.selectedType = 1;
    this.renderer.setProperty(this.qPrompt.nativeElement, 'style', 'display:block;');
  }

  confirmNewQuestion() {
    this.questions.push(new FormGroup({question: new FormControl(null, Validators.required), type: new FormControl(this.selectedType, Validators.required)}));
    this.renderer.setProperty(this.qPrompt.nativeElement, 'style', 'display:none');
    return false;
  }

}

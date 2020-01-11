import { Component, OnInit } from '@angular/core';
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
  questions : Array<FormGroup> = [new FormGroup({question: new FormControl(null, Validators.required), type: new FormControl(null, Validators.required)})];

  constructor() { }

  ngOnInit() {
  }

}

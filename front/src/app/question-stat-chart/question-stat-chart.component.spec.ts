import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionStatChartComponent } from './question-stat-chart.component';

describe('QuestionStatChartComponent', () => {
  let component: QuestionStatChartComponent;
  let fixture: ComponentFixture<QuestionStatChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionStatChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionStatChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

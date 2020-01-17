import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreBarChartComponent } from './score-bar-chart.component';

describe('ScoreBarChartComponent', () => {
  let component: ScoreBarChartComponent;
  let fixture: ComponentFixture<ScoreBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

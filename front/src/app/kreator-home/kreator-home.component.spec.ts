import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KreatorHomeComponent } from './kreator-home.component';

describe('KreatorHomeComponent', () => {
  let component: KreatorHomeComponent;
  let fixture: ComponentFixture<KreatorHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KreatorHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KreatorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

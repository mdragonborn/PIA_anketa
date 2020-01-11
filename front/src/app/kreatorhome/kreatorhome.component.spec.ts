import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KreatorhomeComponent } from './kreatorhome.component';

describe('KreatorhomeComponent', () => {
  let component: KreatorhomeComponent;
  let fixture: ComponentFixture<KreatorhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KreatorhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KreatorhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IspitanikHomeComponent } from './ispitanik-home.component';

describe('IspitanikHomeComponent', () => {
  let component: IspitanikHomeComponent;
  let fixture: ComponentFixture<IspitanikHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IspitanikHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IspitanikHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

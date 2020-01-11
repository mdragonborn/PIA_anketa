import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IspitanikhomeComponent } from './ispitanikhome.component';

describe('IspitanikhomeComponent', () => {
  let component: IspitanikhomeComponent;
  let fixture: ComponentFixture<IspitanikhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IspitanikhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IspitanikhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

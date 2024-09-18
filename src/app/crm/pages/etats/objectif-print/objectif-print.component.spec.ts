import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifPrintComponent } from './objectif-print.component';

describe('ObjectifPrintComponent', () => {
  let component: ObjectifPrintComponent;
  let fixture: ComponentFixture<ObjectifPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectifPrintComponent]
    });
    fixture = TestBed.createComponent(ObjectifPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompterenduPrintComponent } from './compterendu-print.component';

describe('CompterenduPrintComponent', () => {
  let component: CompterenduPrintComponent;
  let fixture: ComponentFixture<CompterenduPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompterenduPrintComponent]
    });
    fixture = TestBed.createComponent(CompterenduPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichekycPrintComponent } from './fichekyc-print.component';

describe('FichekycPrintComponent', () => {
  let component: FichekycPrintComponent;
  let fixture: ComponentFixture<FichekycPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FichekycPrintComponent]
    });
    fixture = TestBed.createComponent(FichekycPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

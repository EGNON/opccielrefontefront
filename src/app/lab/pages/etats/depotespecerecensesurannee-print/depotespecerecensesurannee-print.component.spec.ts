import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotespecerecensesuranneePrintComponent } from './depotespecerecensesurannee-print.component';

describe('DepotespecerecensesuranneePrintComponent', () => {
  let component: DepotespecerecensesuranneePrintComponent;
  let fixture: ComponentFixture<DepotespecerecensesuranneePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotespecerecensesuranneePrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotespecerecensesuranneePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

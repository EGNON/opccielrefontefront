import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotespecerecensesuranneeComponent } from './depotespecerecensesurannee.component';

describe('DepotespecerecensesuranneeComponent', () => {
  let component: DepotespecerecensesuranneeComponent;
  let fixture: ComponentFixture<DepotespecerecensesuranneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotespecerecensesuranneeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotespecerecensesuranneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

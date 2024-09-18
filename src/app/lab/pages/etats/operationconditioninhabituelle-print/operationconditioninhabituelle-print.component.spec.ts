import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationconditioninhabituellePrintComponent } from './operationconditioninhabituelle-print.component';

describe('OperationconditioninhabituellePrintComponent', () => {
  let component: OperationconditioninhabituellePrintComponent;
  let fixture: ComponentFixture<OperationconditioninhabituellePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationconditioninhabituellePrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationconditioninhabituellePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

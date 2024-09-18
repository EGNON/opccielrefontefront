import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationconditionnormalePrintComponent } from './operationconditionnormale-print.component';

describe('OperationconditionnormalePrintComponent', () => {
  let component: OperationconditionnormalePrintComponent;
  let fixture: ComponentFixture<OperationconditionnormalePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationconditionnormalePrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationconditionnormalePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

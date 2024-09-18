import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSuspectInhabituelComponent } from './transaction-suspect-inhabituel.component';

describe('TransactionSuspectInhabituelComponent', () => {
  let component: TransactionSuspectInhabituelComponent;
  let fixture: ComponentFixture<TransactionSuspectInhabituelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionSuspectInhabituelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionSuspectInhabituelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

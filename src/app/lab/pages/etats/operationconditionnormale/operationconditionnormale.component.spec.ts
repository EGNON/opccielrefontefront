import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationconditionnormaleComponent } from './operationconditionnormale.component';

describe('OperationconditionnormaleComponent', () => {
  let component: OperationconditionnormaleComponent;
  let fixture: ComponentFixture<OperationconditionnormaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationconditionnormaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationconditionnormaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

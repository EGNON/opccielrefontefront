import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationextournevdeComponent } from './operationextournevde.component';

describe('OperationextournevdeComponent', () => {
  let component: OperationextournevdeComponent;
  let fixture: ComponentFixture<OperationextournevdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationextournevdeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationextournevdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationdetachementComponent } from './operationdetachement.component';

describe('OperationdetachementComponent', () => {
  let component: OperationdetachementComponent;
  let fixture: ComponentFixture<OperationdetachementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationdetachementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationdetachementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

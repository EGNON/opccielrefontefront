import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationdetachementAddEditComponent } from './operationdetachement-add-edit.component';

describe('OperationdetachementAddEditComponent', () => {
  let component: OperationdetachementAddEditComponent;
  let fixture: ComponentFixture<OperationdetachementAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationdetachementAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationdetachementAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

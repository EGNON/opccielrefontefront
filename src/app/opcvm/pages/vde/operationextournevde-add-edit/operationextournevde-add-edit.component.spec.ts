import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationextournevdeAddEditComponent } from './operationextournevde-add-edit.component';

describe('OperationextournevdeAddEditComponent', () => {
  let component: OperationextournevdeAddEditComponent;
  let fixture: ComponentFixture<OperationextournevdeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationextournevdeAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationextournevdeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModalOperationdetachementComponent } from './delete-modal-operationdetachement.component';

describe('DeleteModalOperationdetachementComponent', () => {
  let component: DeleteModalOperationdetachementComponent;
  let fixture: ComponentFixture<DeleteModalOperationdetachementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteModalOperationdetachementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteModalOperationdetachementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

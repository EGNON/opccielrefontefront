import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypedocumentModalComponent } from './delete-typedocument-modal.component';

describe('DeleteTypedocumentModalComponent', () => {
  let component: DeleteTypedocumentModalComponent;
  let fixture: ComponentFixture<DeleteTypedocumentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteTypedocumentModalComponent]
    });
    fixture = TestBed.createComponent(DeleteTypedocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

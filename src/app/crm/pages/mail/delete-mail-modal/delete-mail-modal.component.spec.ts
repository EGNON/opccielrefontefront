import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMailModalComponent } from './delete-mail-modal.component';

describe('DeleteMailModalComponent', () => {
  let component: DeleteMailModalComponent;
  let fixture: ComponentFixture<DeleteMailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteMailModalComponent]
    });
    fixture = TestBed.createComponent(DeleteMailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

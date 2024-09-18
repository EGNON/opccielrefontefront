import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModalModelemsgalerteComponent } from './delete-modal-modelemsgalerte.component';

describe('DeleteModalModelemsgalerteComponent', () => {
  let component: DeleteModalModelemsgalerteComponent;
  let fixture: ComponentFixture<DeleteModalModelemsgalerteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteModalModelemsgalerteComponent]
    });
    fixture = TestBed.createComponent(DeleteModalModelemsgalerteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

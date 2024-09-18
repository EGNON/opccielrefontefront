import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRdvModalComponent } from './delete-rdv-modal.component';

describe('DeleteRdvModalComponent', () => {
  let component: DeleteRdvModalComponent;
  let fixture: ComponentFixture<DeleteRdvModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRdvModalComponent]
    });
    fixture = TestBed.createComponent(DeleteRdvModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

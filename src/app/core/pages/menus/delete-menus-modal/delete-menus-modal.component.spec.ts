import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMenusModalComponent } from './delete-menus-modal.component';

describe('DeleteMenusModalComponent', () => {
  let component: DeleteMenusModalComponent;
  let fixture: ComponentFixture<DeleteMenusModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteMenusModalComponent]
    });
    fixture = TestBed.createComponent(DeleteMenusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

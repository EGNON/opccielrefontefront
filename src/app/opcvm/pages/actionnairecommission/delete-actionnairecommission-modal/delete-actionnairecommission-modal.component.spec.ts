import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteActionnairecommissionModalComponent } from './delete-actionnairecommission-modal.component';

describe('DeleteActionnairecommissionModalComponent', () => {
  let component: DeleteActionnairecommissionModalComponent;
  let fixture: ComponentFixture<DeleteActionnairecommissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteActionnairecommissionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteActionnairecommissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

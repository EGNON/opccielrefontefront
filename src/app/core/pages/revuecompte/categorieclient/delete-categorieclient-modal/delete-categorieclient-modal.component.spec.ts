import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCategorieclientModalComponent } from './delete-categorieclient-modal.component';

describe('DeleteCategorieclientModalComponent', () => {
  let component: DeleteCategorieclientModalComponent;
  let fixture: ComponentFixture<DeleteCategorieclientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteCategorieclientModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCategorieclientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLangueModalComponent } from './delete-langue-modal.component';

describe('DeleteLangueModalComponent', () => {
  let component: DeleteLangueModalComponent;
  let fixture: ComponentFixture<DeleteLangueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteLangueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteLangueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

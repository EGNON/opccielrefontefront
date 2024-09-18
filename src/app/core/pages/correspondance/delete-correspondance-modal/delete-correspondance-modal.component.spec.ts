import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCorrespondanceModalComponent } from './delete-correspondance-modal.component';

describe('DeleteCorrespondanceModalComponent', () => {
  let component: DeleteCorrespondanceModalComponent;
  let fixture: ComponentFixture<DeleteCorrespondanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteCorrespondanceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCorrespondanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

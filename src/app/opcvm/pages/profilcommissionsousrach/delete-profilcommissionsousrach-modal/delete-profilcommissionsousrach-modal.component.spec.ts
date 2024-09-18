import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProfilcommissionsousrachModalComponent } from './delete-profilcommissionsousrach-modal.component';

describe('DeleteProfilcommissionsousrachModalComponent', () => {
  let component: DeleteProfilcommissionsousrachModalComponent;
  let fixture: ComponentFixture<DeleteProfilcommissionsousrachModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteProfilcommissionsousrachModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteProfilcommissionsousrachModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

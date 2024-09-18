import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePersonnemoraleSanctionneeModalComponent } from './delete-personnemorale-sanctionnee-modal.component';

describe('DeletePersonnemoraleSanctionneeModalComponent', () => {
  let component: DeletePersonnemoraleSanctionneeModalComponent;
  let fixture: ComponentFixture<DeletePersonnemoraleSanctionneeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePersonnemoraleSanctionneeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePersonnemoraleSanctionneeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePersonnephysiqueSanctionneeModalComponent } from './delete-personnephysique-sanctionnee-modal.component';

describe('DeletePersonnephysiqueSanctionneeModalComponent', () => {
  let component: DeletePersonnephysiqueSanctionneeModalComponent;
  let fixture: ComponentFixture<DeletePersonnephysiqueSanctionneeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePersonnephysiqueSanctionneeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePersonnephysiqueSanctionneeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnephysiqueSanctionneeAddEditComponent } from './personnephysique-sanctionnee-add-edit.component';

describe('PersonnephysiqueSanctionneeAddEditComponent', () => {
  let component: PersonnephysiqueSanctionneeAddEditComponent;
  let fixture: ComponentFixture<PersonnephysiqueSanctionneeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnephysiqueSanctionneeAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnephysiqueSanctionneeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

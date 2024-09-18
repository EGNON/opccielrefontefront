import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnemoraleSanctionneeAddEditComponent } from './personnemorale-sanctionnee-add-edit.component';

describe('PersonnemoraleSanctionneeAddEditComponent', () => {
  let component: PersonnemoraleSanctionneeAddEditComponent;
  let fixture: ComponentFixture<PersonnemoraleSanctionneeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnemoraleSanctionneeAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnemoraleSanctionneeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

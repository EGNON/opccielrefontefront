import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnephysiqueSanctionneeComponent } from './personnephysique-sanctionnee.component';

describe('PersonnephysiqueSanctionneeComponent', () => {
  let component: PersonnephysiqueSanctionneeComponent;
  let fixture: ComponentFixture<PersonnephysiqueSanctionneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnephysiqueSanctionneeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnephysiqueSanctionneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

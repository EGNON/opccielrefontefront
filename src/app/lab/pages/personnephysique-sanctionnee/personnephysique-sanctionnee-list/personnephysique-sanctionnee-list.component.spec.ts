import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnephysiqueSanctionneeListComponent } from './personnephysique-sanctionnee-list.component';

describe('PersonnephysiqueSanctionneeListComponent', () => {
  let component: PersonnephysiqueSanctionneeListComponent;
  let fixture: ComponentFixture<PersonnephysiqueSanctionneeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnephysiqueSanctionneeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnephysiqueSanctionneeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

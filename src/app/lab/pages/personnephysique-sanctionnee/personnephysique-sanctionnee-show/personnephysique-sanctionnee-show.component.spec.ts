import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnephysiqueSanctionneeShowComponent } from './personnephysique-sanctionnee-show.component';

describe('PersonnephysiqueSanctionneeShowComponent', () => {
  let component: PersonnephysiqueSanctionneeShowComponent;
  let fixture: ComponentFixture<PersonnephysiqueSanctionneeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnephysiqueSanctionneeShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnephysiqueSanctionneeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

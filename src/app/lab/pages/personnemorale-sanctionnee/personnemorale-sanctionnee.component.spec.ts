import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnemoraleSanctionneeComponent } from './personnemorale-sanctionnee.component';

describe('PersonnemoraleSanctionneeComponent', () => {
  let component: PersonnemoraleSanctionneeComponent;
  let fixture: ComponentFixture<PersonnemoraleSanctionneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnemoraleSanctionneeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnemoraleSanctionneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

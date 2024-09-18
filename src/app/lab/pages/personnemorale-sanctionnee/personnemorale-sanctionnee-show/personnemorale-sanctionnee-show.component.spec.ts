import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnemoraleSanctionneeShowComponent } from './personnemorale-sanctionnee-show.component';

describe('PersonnemoraleSanctionneeShowComponent', () => {
  let component: PersonnemoraleSanctionneeShowComponent;
  let fixture: ComponentFixture<PersonnemoraleSanctionneeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnemoraleSanctionneeShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnemoraleSanctionneeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

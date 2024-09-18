import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnemoraleSanctionneeListComponent } from './personnemorale-sanctionnee-list.component';

describe('PersonnemoraleSanctionneeListComponent', () => {
  let component: PersonnemoraleSanctionneeListComponent;
  let fixture: ComponentFixture<PersonnemoraleSanctionneeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnemoraleSanctionneeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnemoraleSanctionneeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

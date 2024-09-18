import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMoraleJugeAddEditComponent } from './personne-morale-juge-add-edit.component';

describe('PersonneMoraleJugeAddEditComponent', () => {
  let component: PersonneMoraleJugeAddEditComponent;
  let fixture: ComponentFixture<PersonneMoraleJugeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneMoraleJugeAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonneMoraleJugeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

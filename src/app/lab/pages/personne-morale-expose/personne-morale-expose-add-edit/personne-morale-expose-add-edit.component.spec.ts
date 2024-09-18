import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMoraleExposeAddEditComponent } from './personne-morale-expose-add-edit.component';

describe('PersonneMoraleExposeAddEditComponent', () => {
  let component: PersonneMoraleExposeAddEditComponent;
  let fixture: ComponentFixture<PersonneMoraleExposeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneMoraleExposeAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonneMoraleExposeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelAddEditComponent } from './personnel-add-edit.component';

describe('PersonnelAddEditComponent', () => {
  let component: PersonnelAddEditComponent;
  let fixture: ComponentFixture<PersonnelAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnelAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnelAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

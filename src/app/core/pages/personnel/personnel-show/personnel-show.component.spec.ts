import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelShowComponent } from './personnel-show.component';

describe('PersonnelShowComponent', () => {
  let component: PersonnelShowComponent;
  let fixture: ComponentFixture<PersonnelShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnelShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnelShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

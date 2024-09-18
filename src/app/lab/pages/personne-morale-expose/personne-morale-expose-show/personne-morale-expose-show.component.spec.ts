import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMoraleExposeShowComponent } from './personne-morale-expose-show.component';

describe('PersonneMoraleExposeShowComponent', () => {
  let component: PersonneMoraleExposeShowComponent;
  let fixture: ComponentFixture<PersonneMoraleExposeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonneMoraleExposeShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonneMoraleExposeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

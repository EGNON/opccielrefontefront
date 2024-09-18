import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMoraleExposeComponent } from './personne-morale-expose.component';

describe('PersonneMoraleExposeComponent', () => {
  let component: PersonneMoraleExposeComponent;
  let fixture: ComponentFixture<PersonneMoraleExposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneMoraleExposeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonneMoraleExposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMoraleExposeListComponent } from './personne-morale-expose-list.component';

describe('PersonneMoraleExposeListComponent', () => {
  let component: PersonneMoraleExposeListComponent;
  let fixture: ComponentFixture<PersonneMoraleExposeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneMoraleExposeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonneMoraleExposeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

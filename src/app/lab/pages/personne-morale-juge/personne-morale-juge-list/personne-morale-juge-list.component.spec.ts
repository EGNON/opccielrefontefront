import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMoraleJugeListComponent } from './personne-morale-juge-list.component';

describe('PersonneMoraleJugeListComponent', () => {
  let component: PersonneMoraleJugeListComponent;
  let fixture: ComponentFixture<PersonneMoraleJugeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneMoraleJugeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonneMoraleJugeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

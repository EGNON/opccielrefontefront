import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMoraleJugeShowComponent } from './personne-morale-juge-show.component';

describe('PersonneMoraleJugeShowComponent', () => {
  let component: PersonneMoraleJugeShowComponent;
  let fixture: ComponentFixture<PersonneMoraleJugeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonneMoraleJugeShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonneMoraleJugeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

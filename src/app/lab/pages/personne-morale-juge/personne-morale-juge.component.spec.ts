import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMoraleJugeComponent } from './personne-morale-juge.component';

describe('PersonneMoraleJugeComponent', () => {
  let component: PersonneMoraleJugeComponent;
  let fixture: ComponentFixture<PersonneMoraleJugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneMoraleJugeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonneMoraleJugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

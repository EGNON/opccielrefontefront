import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnePhysiqueJugeComponent } from './personne-physique-juge.component';

describe('PersonnePhysiqueJugeComponent', () => {
  let component: PersonnePhysiqueJugeComponent;
  let fixture: ComponentFixture<PersonnePhysiqueJugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnePhysiqueJugeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnePhysiqueJugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

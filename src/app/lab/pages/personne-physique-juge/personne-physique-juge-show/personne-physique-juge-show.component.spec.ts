import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnePhysiqueJugeShowComponent } from './personne-physique-juge-show.component';

describe('PersonnePhysiqueJugeShowComponent', () => {
  let component: PersonnePhysiqueJugeShowComponent;
  let fixture: ComponentFixture<PersonnePhysiqueJugeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnePhysiqueJugeShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnePhysiqueJugeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

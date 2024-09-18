import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnePhysiqueShowComponent } from './personne-physique-show.component';

describe('PersonnePhysiqueShowComponent', () => {
  let component: PersonnePhysiqueShowComponent;
  let fixture: ComponentFixture<PersonnePhysiqueShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnePhysiqueShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnePhysiqueShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

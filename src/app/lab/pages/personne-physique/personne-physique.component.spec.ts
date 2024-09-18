import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnePhysiqueComponent } from './personne-physique.component';

describe('PersonnePhysiqueComponent', () => {
  let component: PersonnePhysiqueComponent;
  let fixture: ComponentFixture<PersonnePhysiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnePhysiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnePhysiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnePhysiqueJugeListComponent } from './personne-physique-juge-list.component';

describe('PersonnePhysiqueJugeListComponent', () => {
  let component: PersonnePhysiqueJugeListComponent;
  let fixture: ComponentFixture<PersonnePhysiqueJugeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnePhysiqueJugeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnePhysiqueJugeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

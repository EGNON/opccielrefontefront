import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnePhysiqueListComponent } from './personne-physique-list.component';

describe('PersonnePhysiqueListComponent', () => {
  let component: PersonnePhysiqueListComponent;
  let fixture: ComponentFixture<PersonnePhysiqueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnePhysiqueListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnePhysiqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

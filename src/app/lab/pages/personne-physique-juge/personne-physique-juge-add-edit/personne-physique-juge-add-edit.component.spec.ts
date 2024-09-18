import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnePhysiqueJugeAddEditComponent } from './personne-physique-juge-add-edit.component';

describe('PersonnePhysiqueJugeAddEditComponent', () => {
  let component: PersonnePhysiqueJugeAddEditComponent;
  let fixture: ComponentFixture<PersonnePhysiqueJugeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnePhysiqueJugeAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnePhysiqueJugeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

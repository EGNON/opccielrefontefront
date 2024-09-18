import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnePhysiqueAddEditComponent } from './personne-physique-add-edit.component';

describe('PersonnePhysiqueAddEditComponent', () => {
  let component: PersonnePhysiqueAddEditComponent;
  let fixture: ComponentFixture<PersonnePhysiqueAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnePhysiqueAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnePhysiqueAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

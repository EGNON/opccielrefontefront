import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePersonnePhysiqueModaleComponent } from './delete-personne-physique-modale.component';

describe('DeletePersonnePhysiqueModaleComponent', () => {
  let component: DeletePersonnePhysiqueModaleComponent;
  let fixture: ComponentFixture<DeletePersonnePhysiqueModaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePersonnePhysiqueModaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePersonnePhysiqueModaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

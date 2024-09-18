import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePersonnePhysiqueJugeModalComponent } from './delete-personne-physique-juge-modal.component';

describe('DeletePersonnePhysiqueJugeModalComponent', () => {
  let component: DeletePersonnePhysiqueJugeModalComponent;
  let fixture: ComponentFixture<DeletePersonnePhysiqueJugeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePersonnePhysiqueJugeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePersonnePhysiqueJugeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

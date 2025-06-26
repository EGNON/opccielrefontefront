import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModalOperationevenementsurvaleurComponent } from './delete-modal-operationevenementsurvaleur.component';

describe('DeleteModalOperationevenementsurvaleurComponent', () => {
  let component: DeleteModalOperationevenementsurvaleurComponent;
  let fixture: ComponentFixture<DeleteModalOperationevenementsurvaleurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteModalOperationevenementsurvaleurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteModalOperationevenementsurvaleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

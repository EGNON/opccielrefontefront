import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePersonneMoraleJugeModalComponent } from './delete-personne-morale-juge-modal.component';

describe('DeletePersonneMoraleJugeModalComponent', () => {
  let component: DeletePersonneMoraleJugeModalComponent;
  let fixture: ComponentFixture<DeletePersonneMoraleJugeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePersonneMoraleJugeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePersonneMoraleJugeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

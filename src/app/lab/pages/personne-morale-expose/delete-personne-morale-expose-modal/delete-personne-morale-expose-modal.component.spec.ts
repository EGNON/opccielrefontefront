import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePersonneMoraleExposeModalComponent } from './delete-personne-morale-expose-modal.component';

describe('DeletePersonneMoraleExposeModalComponent', () => {
  let component: DeletePersonneMoraleExposeModalComponent;
  let fixture: ComponentFixture<DeletePersonneMoraleExposeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePersonneMoraleExposeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePersonneMoraleExposeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

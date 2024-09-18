import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTarificationordinaireModalComponent } from './delete-tarificationordinaire-modal.component';

describe('DeleteTarificationordinaireModalComponent', () => {
  let component: DeleteTarificationordinaireModalComponent;
  let fixture: ComponentFixture<DeleteTarificationordinaireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTarificationordinaireModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTarificationordinaireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

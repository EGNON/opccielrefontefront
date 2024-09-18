import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteComptecomptableModalComponent } from './delete-comptecomptable-modal.component';

describe('DeleteComptecomptableModalComponent', () => {
  let component: DeleteComptecomptableModalComponent;
  let fixture: ComponentFixture<DeleteComptecomptableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteComptecomptableModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteComptecomptableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

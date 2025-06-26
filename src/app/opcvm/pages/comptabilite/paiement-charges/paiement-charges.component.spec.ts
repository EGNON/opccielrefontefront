import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementChargesComponent } from './paiement-charges.component';

describe('PaiementChargesComponent', () => {
  let component: PaiementChargesComponent;
  let fixture: ComponentFixture<PaiementChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaiementChargesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

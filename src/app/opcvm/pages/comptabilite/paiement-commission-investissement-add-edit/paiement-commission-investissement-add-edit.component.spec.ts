import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementCommissionInvestissementAddEditComponent } from './paiement-commission-investissement-add-edit.component';

describe('PaiementCommissionInvestissementAddEditComponent', () => {
  let component: PaiementCommissionInvestissementAddEditComponent;
  let fixture: ComponentFixture<PaiementCommissionInvestissementAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaiementCommissionInvestissementAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementCommissionInvestissementAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

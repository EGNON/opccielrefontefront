import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementCommissionInvestissementListComponent } from './paiement-commission-investissement-list.component';

describe('PaiementCommissionInvestissementListComponent', () => {
  let component: PaiementCommissionInvestissementListComponent;
  let fixture: ComponentFixture<PaiementCommissionInvestissementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaiementCommissionInvestissementListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementCommissionInvestissementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

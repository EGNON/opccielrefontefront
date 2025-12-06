import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisionnelRemboursement } from './previsionnel-remboursement';

describe('PrevisionnelRemboursement', () => {
  let component: PrevisionnelRemboursement;
  let fixture: ComponentFixture<PrevisionnelRemboursement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrevisionnelRemboursement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevisionnelRemboursement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

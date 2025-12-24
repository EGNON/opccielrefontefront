import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifsouscriptiontransferttitreN1N2 } from './verifsouscriptiontransferttitre-n1-n2';

describe('VerifsouscriptiontransferttitreN1N2', () => {
  let component: VerifsouscriptiontransferttitreN1N2;
  let fixture: ComponentFixture<VerifsouscriptiontransferttitreN1N2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifsouscriptiontransferttitreN1N2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifsouscriptiontransferttitreN1N2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

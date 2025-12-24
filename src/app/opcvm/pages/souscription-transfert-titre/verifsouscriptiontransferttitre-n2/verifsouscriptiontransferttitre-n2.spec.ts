import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifsouscriptiontransferttitreN2 } from './verifsouscriptiontransferttitre-n2';

describe('VerifsouscriptiontransferttitreN2', () => {
  let component: VerifsouscriptiontransferttitreN2;
  let fixture: ComponentFixture<VerifsouscriptiontransferttitreN2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifsouscriptiontransferttitreN2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifsouscriptiontransferttitreN2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifDepotsouscriptionNiv2Component } from './verif-depotsouscription-niv2.component';

describe('VerifDepotsouscriptionNiv2Component', () => {
  let component: VerifDepotsouscriptionNiv2Component;
  let fixture: ComponentFixture<VerifDepotsouscriptionNiv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifDepotsouscriptionNiv2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifDepotsouscriptionNiv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

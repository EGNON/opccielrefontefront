import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifDepotsouscriptionNiv1Component } from './verif-depotsouscription-niv1.component';

describe('VerifDepotsouscriptionNiv1Component', () => {
  let component: VerifDepotsouscriptionNiv1Component;
  let fixture: ComponentFixture<VerifDepotsouscriptionNiv1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifDepotsouscriptionNiv1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifDepotsouscriptionNiv1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

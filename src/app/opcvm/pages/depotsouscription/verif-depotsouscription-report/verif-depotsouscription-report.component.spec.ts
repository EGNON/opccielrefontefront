import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifDepotsouscriptionReportComponent } from './verif-depotsouscription-report.component';

describe('VerifDepotsouscriptionReportComponent', () => {
  let component: VerifDepotsouscriptionReportComponent;
  let fixture: ComponentFixture<VerifDepotsouscriptionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifDepotsouscriptionReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifDepotsouscriptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

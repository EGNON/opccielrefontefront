import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotsuperieuradixmillionsPrintComponent } from './depotsuperieuradixmillions-print.component';

describe('DepotsuperieuradixmillionsPrintComponent', () => {
  let component: DepotsuperieuradixmillionsPrintComponent;
  let fixture: ComponentFixture<DepotsuperieuradixmillionsPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotsuperieuradixmillionsPrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotsuperieuradixmillionsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

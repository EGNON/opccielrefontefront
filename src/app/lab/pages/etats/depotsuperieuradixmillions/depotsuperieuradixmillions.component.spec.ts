import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotsuperieuradixmillionsComponent } from './depotsuperieuradixmillions.component';

describe('DepotsuperieuradixmillionsComponent', () => {
  let component: DepotsuperieuradixmillionsComponent;
  let fixture: ComponentFixture<DepotsuperieuradixmillionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotsuperieuradixmillionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotsuperieuradixmillionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

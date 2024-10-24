import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotsouscriptionComponent } from './depotsouscription.component';

describe('DepotsouscriptionComponent', () => {
  let component: DepotsouscriptionComponent;
  let fixture: ComponentFixture<DepotsouscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotsouscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotsouscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

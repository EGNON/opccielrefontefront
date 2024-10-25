import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotsouscriptionGenerateComponent } from './depotsouscription-generate.component';

describe('DepotsouscriptionGenerateComponent', () => {
  let component: DepotsouscriptionGenerateComponent;
  let fixture: ComponentFixture<DepotsouscriptionGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotsouscriptionGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotsouscriptionGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

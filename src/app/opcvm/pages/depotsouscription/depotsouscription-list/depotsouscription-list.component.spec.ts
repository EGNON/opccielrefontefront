import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotsouscriptionListComponent } from './depotsouscription-list.component';

describe('DepotsouscriptionListComponent', () => {
  let component: DepotsouscriptionListComponent;
  let fixture: ComponentFixture<DepotsouscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotsouscriptionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotsouscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

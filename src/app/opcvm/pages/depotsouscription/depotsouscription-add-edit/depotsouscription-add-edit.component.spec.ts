import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotsouscriptionAddEditComponent } from './depotsouscription-add-edit.component';

describe('DepotsouscriptionAddEditComponent', () => {
  let component: DepotsouscriptionAddEditComponent;
  let fixture: ComponentFixture<DepotsouscriptionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotsouscriptionAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotsouscriptionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

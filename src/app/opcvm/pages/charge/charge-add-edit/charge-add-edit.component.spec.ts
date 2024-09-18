import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeAddEditComponent } from './charge-add-edit.component';

describe('ChargeAddEditComponent', () => {
  let component: ChargeAddEditComponent;
  let fixture: ComponentFixture<ChargeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChargeAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

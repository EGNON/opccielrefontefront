import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanqueAddEditComponent } from './banque-add-edit.component';

describe('BanqueAddEditComponent', () => {
  let component: BanqueAddEditComponent;
  let fixture: ComponentFixture<BanqueAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BanqueAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BanqueAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

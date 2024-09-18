import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoustypeactionAddEditComponent } from './soustypeaction-add-edit.component';

describe('SoustypeactionAddEditComponent', () => {
  let component: SoustypeactionAddEditComponent;
  let fixture: ComponentFixture<SoustypeactionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoustypeactionAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoustypeactionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

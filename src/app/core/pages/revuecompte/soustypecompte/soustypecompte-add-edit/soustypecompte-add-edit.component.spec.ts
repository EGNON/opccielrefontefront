import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoustypecompteAddEditComponent } from './soustypecompte-add-edit.component';

describe('SoustypecompteAddEditComponent', () => {
  let component: SoustypecompteAddEditComponent;
  let fixture: ComponentFixture<SoustypecompteAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoustypecompteAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoustypecompteAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

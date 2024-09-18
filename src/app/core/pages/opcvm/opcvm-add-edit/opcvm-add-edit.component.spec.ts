import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcvmAddEditComponent } from './opcvm-add-edit.component';

describe('OpcvmAddEditComponent', () => {
  let component: OpcvmAddEditComponent;
  let fixture: ComponentFixture<OpcvmAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpcvmAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpcvmAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

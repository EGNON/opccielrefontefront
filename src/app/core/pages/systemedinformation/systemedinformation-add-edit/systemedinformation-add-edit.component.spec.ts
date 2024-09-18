import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemedinformationAddEditComponent } from './systemedinformation-add-edit.component';

describe('SystemedinformationAddEditComponent', () => {
  let component: SystemedinformationAddEditComponent;
  let fixture: ComponentFixture<SystemedinformationAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemedinformationAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemedinformationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

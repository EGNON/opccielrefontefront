import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormejuridiqueAddEditComponent } from './formejuridique-add-edit.component';

describe('FormejuridiqueAddEditComponent', () => {
  let component: FormejuridiqueAddEditComponent;
  let fixture: ComponentFixture<FormejuridiqueAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormejuridiqueAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormejuridiqueAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

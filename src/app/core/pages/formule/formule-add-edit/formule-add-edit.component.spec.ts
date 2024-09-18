import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormuleAddEditComponent } from './formule-add-edit.component';

describe('FormuleAddEditComponent', () => {
  let component: FormuleAddEditComponent;
  let fixture: ComponentFixture<FormuleAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormuleAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormuleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

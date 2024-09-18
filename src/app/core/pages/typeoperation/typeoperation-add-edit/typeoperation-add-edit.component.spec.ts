import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeoperationAddEditComponent } from './typeoperation-add-edit.component';

describe('TypeoperationAddEditComponent', () => {
  let component: TypeoperationAddEditComponent;
  let fixture: ComponentFixture<TypeoperationAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeoperationAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeoperationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

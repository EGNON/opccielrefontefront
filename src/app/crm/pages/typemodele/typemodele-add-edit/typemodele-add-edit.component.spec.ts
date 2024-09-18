import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypemodeleAddEditComponent } from './typemodele-add-edit.component';

describe('TypemodeleAddEditComponent', () => {
  let component: TypemodeleAddEditComponent;
  let fixture: ComponentFixture<TypemodeleAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypemodeleAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypemodeleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

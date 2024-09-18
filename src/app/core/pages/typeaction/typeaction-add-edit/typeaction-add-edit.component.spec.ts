import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeactionAddEditComponent } from './typeaction-add-edit.component';

describe('TypeactionAddEditComponent', () => {
  let component: TypeactionAddEditComponent;
  let fixture: ComponentFixture<TypeactionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeactionAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeactionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

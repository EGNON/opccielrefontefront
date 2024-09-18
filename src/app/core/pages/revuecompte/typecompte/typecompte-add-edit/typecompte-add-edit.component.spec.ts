import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypecompteAddEditComponent } from './typecompte-add-edit.component';

describe('TypecompteAddEditComponent', () => {
  let component: TypecompteAddEditComponent;
  let fixture: ComponentFixture<TypecompteAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypecompteAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypecompteAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

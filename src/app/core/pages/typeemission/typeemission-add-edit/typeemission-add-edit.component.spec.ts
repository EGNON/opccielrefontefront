import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeemissionAddEditComponent } from './typeemission-add-edit.component';

describe('TypeemissionAddEditComponent', () => {
  let component: TypeemissionAddEditComponent;
  let fixture: ComponentFixture<TypeemissionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeemissionAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeemissionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

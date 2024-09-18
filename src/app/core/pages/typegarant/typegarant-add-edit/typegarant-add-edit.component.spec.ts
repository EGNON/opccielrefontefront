import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypegarantAddEditComponent } from './typegarant-add-edit.component';

describe('TypegarantAddEditComponent', () => {
  let component: TypegarantAddEditComponent;
  let fixture: ComponentFixture<TypegarantAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypegarantAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypegarantAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

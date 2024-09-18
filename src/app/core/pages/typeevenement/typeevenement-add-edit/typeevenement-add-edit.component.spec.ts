import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeevenementAddEditComponent } from './typeevenement-add-edit.component';

describe('TypeevenementAddEditComponent', () => {
  let component: TypeevenementAddEditComponent;
  let fixture: ComponentFixture<TypeevenementAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeevenementAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeevenementAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeemetteurAddEditComponent } from './typeemetteur-add-edit.component';

describe('TypeemetteurAddEditComponent', () => {
  let component: TypeemetteurAddEditComponent;
  let fixture: ComponentFixture<TypeemetteurAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeemetteurAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeemetteurAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

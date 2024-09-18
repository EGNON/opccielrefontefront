import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionnaireopcvmAddEditComponent } from './actionnaireopcvm-add-edit.component';

describe('ActionnaireopcvmAddEditComponent', () => {
  let component: ActionnaireopcvmAddEditComponent;
  let fixture: ComponentFixture<ActionnaireopcvmAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionnaireopcvmAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionnaireopcvmAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

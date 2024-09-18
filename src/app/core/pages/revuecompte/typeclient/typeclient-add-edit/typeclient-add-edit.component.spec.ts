import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeclientAddEditComponent } from './typeclient-add-edit.component';

describe('TypeclientAddEditComponent', () => {
  let component: TypeclientAddEditComponent;
  let fixture: ComponentFixture<TypeclientAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeclientAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeclientAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

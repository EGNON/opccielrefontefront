import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionnairecommissionAddEditComponent } from './actionnairecommission-add-edit.component';

describe('ActionnairecommissionAddEditComponent', () => {
  let component: ActionnairecommissionAddEditComponent;
  let fixture: ComponentFixture<ActionnairecommissionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionnairecommissionAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionnairecommissionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

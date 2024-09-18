import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionnairecommissionListComponent } from './actionnairecommission-list.component';

describe('ActionnairecommissionListComponent', () => {
  let component: ActionnairecommissionListComponent;
  let fixture: ComponentFixture<ActionnairecommissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionnairecommissionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionnairecommissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

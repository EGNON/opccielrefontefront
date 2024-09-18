import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionnairecommissionComponent } from './actionnairecommission.component';

describe('ActionnairecommissionComponent', () => {
  let component: ActionnairecommissionComponent;
  let fixture: ComponentFixture<ActionnairecommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionnairecommissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionnairecommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdreAddEditComponent } from './ordre-add-edit.component';

describe('OrdreAddEditComponent', () => {
  let component: OrdreAddEditComponent;
  let fixture: ComponentFixture<OrdreAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdreAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdreAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

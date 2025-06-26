import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulecartsoldeAddEditComponent } from './regulecartsolde-add-edit.component';

describe('RegulecartsoldeAddEditComponent', () => {
  let component: RegulecartsoldeAddEditComponent;
  let fixture: ComponentFixture<RegulecartsoldeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegulecartsoldeAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegulecartsoldeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

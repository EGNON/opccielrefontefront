import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeldegelAddEditComponent } from './geldegel-add-edit.component';

describe('GeldegelAddEditComponent', () => {
  let component: GeldegelAddEditComponent;
  let fixture: ComponentFixture<GeldegelAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeldegelAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeldegelAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartimentAddEditComponent } from './compartiment-add-edit.component';

describe('CompartimentAddEditComponent', () => {
  let component: CompartimentAddEditComponent;
  let fixture: ComponentFixture<CompartimentAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompartimentAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompartimentAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

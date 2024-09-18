import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvAddEditComponent } from './rdv-add-edit.component';

describe('RdvAddEditComponent', () => {
  let component: RdvAddEditComponent;
  let fixture: ComponentFixture<RdvAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RdvAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RdvAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceAddEditComponent } from './place-add-edit.component';

describe('PlaceAddEditComponent', () => {
  let component: PlaceAddEditComponent;
  let fixture: ComponentFixture<PlaceAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaceAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

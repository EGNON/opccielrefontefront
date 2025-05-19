import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdreencoursComponent } from './ordreencours.component';

describe('OrdreencoursComponent', () => {
  let component: OrdreencoursComponent;
  let fixture: ComponentFixture<OrdreencoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdreencoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdreencoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodiciteComponent } from './periodicite.component';

describe('PeriodiciteComponent', () => {
  let component: PeriodiciteComponent;
  let fixture: ComponentFixture<PeriodiciteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeriodiciteComponent]
    });
    fixture = TestBed.createComponent(PeriodiciteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

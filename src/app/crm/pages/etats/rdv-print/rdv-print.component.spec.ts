import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvPrintComponent } from './rdv-print.component';

describe('RdvPrintComponent', () => {
  let component: RdvPrintComponent;
  let fixture: ComponentFixture<RdvPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RdvPrintComponent]
    });
    fixture = TestBed.createComponent(RdvPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectPrintComponent } from './prospect-print.component';

describe('ProspectPrintComponent', () => {
  let component: ProspectPrintComponent;
  let fixture: ComponentFixture<ProspectPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProspectPrintComponent]
    });
    fixture = TestBed.createComponent(ProspectPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

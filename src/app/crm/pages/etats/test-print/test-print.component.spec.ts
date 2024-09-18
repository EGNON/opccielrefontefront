import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPrintComponent } from './test-print.component';

describe('TestPrintComponent', () => {
  let component: TestPrintComponent;
  let fixture: ComponentFixture<TestPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestPrintComponent]
    });
    fixture = TestBed.createComponent(TestPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

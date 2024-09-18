import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPrint2Component } from './test-print-2.component';

describe('TestPrint2Component', () => {
  let component: TestPrint2Component;
  let fixture: ComponentFixture<TestPrint2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestPrint2Component]
    });
    fixture = TestBed.createComponent(TestPrint2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

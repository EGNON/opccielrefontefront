import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Circulaire8Component } from './circulaire8.component';

describe('Circulaire8Component', () => {
  let component: Circulaire8Component;
  let fixture: ComponentFixture<Circulaire8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Circulaire8Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Circulaire8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

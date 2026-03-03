import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deleteparametrejoursferiesmodal } from './deleteparametrejoursferiesmodal';

describe('Deleteparametrejoursferiesmodal', () => {
  let component: Deleteparametrejoursferiesmodal;
  let fixture: ComponentFixture<Deleteparametrejoursferiesmodal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Deleteparametrejoursferiesmodal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Deleteparametrejoursferiesmodal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

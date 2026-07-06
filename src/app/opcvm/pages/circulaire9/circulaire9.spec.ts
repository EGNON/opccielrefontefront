import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Circulaire9 } from './circulaire9';

describe('Circulaire9', () => {
  let component: Circulaire9;
  let fixture: ComponentFixture<Circulaire9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Circulaire9]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Circulaire9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

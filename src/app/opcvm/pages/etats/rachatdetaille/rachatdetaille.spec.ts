import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rachatdetaille } from './rachatdetaille';

describe('Rachatdetaille', () => {
  let component: Rachatdetaille;
  let fixture: ComponentFixture<Rachatdetaille>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Rachatdetaille]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rachatdetaille);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

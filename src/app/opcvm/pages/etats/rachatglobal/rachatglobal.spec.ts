import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rachatglobal } from './rachatglobal';

describe('Rachatglobal', () => {
  let component: Rachatglobal;
  let fixture: ComponentFixture<Rachatglobal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Rachatglobal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rachatglobal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

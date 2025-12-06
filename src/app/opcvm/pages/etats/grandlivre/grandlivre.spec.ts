import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grandlivre } from './grandlivre';

describe('Grandlivre', () => {
  let component: Grandlivre;
  let fixture: ComponentFixture<Grandlivre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Grandlivre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Grandlivre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

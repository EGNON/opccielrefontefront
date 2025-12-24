import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exercicecloture } from './exercicecloture';

describe('Exercicecloture', () => {
  let component: Exercicecloture;
  let fixture: ComponentFixture<Exercicecloture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Exercicecloture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exercicecloture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

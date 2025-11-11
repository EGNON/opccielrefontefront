import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bilanannuelf2 } from './bilanannuelf2';

describe('Bilanannuelf2', () => {
  let component: Bilanannuelf2;
  let fixture: ComponentFixture<Bilanannuelf2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Bilanannuelf2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bilanannuelf2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

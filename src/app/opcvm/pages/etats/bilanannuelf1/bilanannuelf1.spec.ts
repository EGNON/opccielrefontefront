import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bilanannuelf1 } from './bilanannuelf1';

describe('Bilanannuelf1', () => {
  let component: Bilanannuelf1;
  let fixture: ComponentFixture<Bilanannuelf1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Bilanannuelf1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bilanannuelf1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

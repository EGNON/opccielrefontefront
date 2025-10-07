import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pointrachat } from './pointrachat';

describe('Pointrachat', () => {
  let component: Pointrachat;
  let fixture: ComponentFixture<Pointrachat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Pointrachat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pointrachat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

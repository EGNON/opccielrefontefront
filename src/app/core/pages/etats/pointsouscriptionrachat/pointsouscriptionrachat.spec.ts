import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pointsouscriptionrachat } from './pointsouscriptionrachat';

describe('Pointsouscriptionrachat', () => {
  let component: Pointsouscriptionrachat;
  let fixture: ComponentFixture<Pointsouscriptionrachat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Pointsouscriptionrachat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pointsouscriptionrachat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Definitionarrondi } from './definitionarrondi';

describe('Definitionarrondi', () => {
  let component: Definitionarrondi;
  let fixture: ComponentFixture<Definitionarrondi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Definitionarrondi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Definitionarrondi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

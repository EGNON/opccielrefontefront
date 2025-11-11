import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bilanannuelannexe } from './bilanannuelannexe';

describe('Bilanannuelannexe', () => {
  let component: Bilanannuelannexe;
  let fixture: ComponentFixture<Bilanannuelannexe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Bilanannuelannexe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bilanannuelannexe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

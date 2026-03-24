import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Relachementordre } from './relachementordre';

describe('Relachementordre', () => {
  let component: Relachementordre;
  let fixture: ComponentFixture<Relachementordre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Relachementordre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Relachementordre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

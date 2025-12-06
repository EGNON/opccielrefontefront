import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bilantrimestriel } from './bilantrimestriel';

describe('Bilantrimestriel', () => {
  let component: Bilantrimestriel;
  let fixture: ComponentFixture<Bilantrimestriel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bilantrimestriel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bilantrimestriel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

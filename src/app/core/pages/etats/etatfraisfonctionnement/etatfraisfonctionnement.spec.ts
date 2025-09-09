import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Etatfraisfonctionnement } from './etatfraisfonctionnement';

describe('Etatfraisfonctionnement', () => {
  let component: Etatfraisfonctionnement;
  let fixture: ComponentFixture<Etatfraisfonctionnement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Etatfraisfonctionnement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Etatfraisfonctionnement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

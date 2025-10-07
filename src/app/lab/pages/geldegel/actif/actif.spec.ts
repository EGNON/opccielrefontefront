import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actif } from './actif';

describe('Actif', () => {
  let component: Actif;
  let fixture: ComponentFixture<Actif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Actif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Actif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

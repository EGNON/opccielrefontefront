import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Controlprofil } from './controlprofil';

describe('Controlprofil', () => {
  let component: Controlprofil;
  let fixture: ComponentFixture<Controlprofil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Controlprofil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Controlprofil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

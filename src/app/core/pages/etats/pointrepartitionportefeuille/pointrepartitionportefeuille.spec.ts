import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pointrepartitionportefeuille } from './pointrepartitionportefeuille';

describe('Pointrepartitionportefeuille', () => {
  let component: Pointrepartitionportefeuille;
  let fixture: ComponentFixture<Pointrepartitionportefeuille>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Pointrepartitionportefeuille]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pointrepartitionportefeuille);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

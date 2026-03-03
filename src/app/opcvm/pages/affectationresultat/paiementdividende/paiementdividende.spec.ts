import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paiementdividende } from './paiementdividende';

describe('Paiementdividende', () => {
  let component: Paiementdividende;
  let fixture: ComponentFixture<Paiementdividende>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Paiementdividende]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paiementdividende);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

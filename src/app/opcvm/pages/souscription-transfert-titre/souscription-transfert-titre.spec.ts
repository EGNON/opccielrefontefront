import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscriptionTransfertTitre } from './souscription-transfert-titre';

describe('SouscriptionTransfertTitre', () => {
  let component: SouscriptionTransfertTitre;
  let fixture: ComponentFixture<SouscriptionTransfertTitre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SouscriptionTransfertTitre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SouscriptionTransfertTitre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

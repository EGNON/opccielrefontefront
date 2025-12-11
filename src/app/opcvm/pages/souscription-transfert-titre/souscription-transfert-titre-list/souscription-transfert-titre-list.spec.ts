import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscriptionTransfertTitreList } from './souscription-transfert-titre-list';

describe('SouscriptionTransfertTitreList', () => {
  let component: SouscriptionTransfertTitreList;
  let fixture: ComponentFixture<SouscriptionTransfertTitreList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SouscriptionTransfertTitreList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SouscriptionTransfertTitreList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

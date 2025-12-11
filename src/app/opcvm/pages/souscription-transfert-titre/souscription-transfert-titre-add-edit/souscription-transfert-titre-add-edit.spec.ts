import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscriptionTransfertTitreAddEdit } from './souscription-transfert-titre-add-edit';

describe('SouscriptionTransfertTitreAddEdit', () => {
  let component: SouscriptionTransfertTitreAddEdit;
  let fixture: ComponentFixture<SouscriptionTransfertTitreAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SouscriptionTransfertTitreAddEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SouscriptionTransfertTitreAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

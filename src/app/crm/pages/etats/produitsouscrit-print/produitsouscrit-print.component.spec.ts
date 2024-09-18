import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitsouscritPrintComponent } from './produitsouscrit-print.component';

describe('ProduitsouscritPrintComponent', () => {
  let component: ProduitsouscritPrintComponent;
  let fixture: ComponentFixture<ProduitsouscritPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitsouscritPrintComponent]
    });
    fixture = TestBed.createComponent(ProduitsouscritPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

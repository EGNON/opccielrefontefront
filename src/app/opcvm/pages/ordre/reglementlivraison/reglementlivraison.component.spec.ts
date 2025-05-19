import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementlivraisonComponent } from './reglementlivraison.component';

describe('ReglementlivraisonComponent', () => {
  let component: ReglementlivraisonComponent;
  let fixture: ComponentFixture<ReglementlivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReglementlivraisonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReglementlivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

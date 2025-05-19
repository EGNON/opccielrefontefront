import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationreglementlivraisonComponent } from './generationreglementlivraison.component';

describe('GenerationreglementlivraisonComponent', () => {
  let component: GenerationreglementlivraisonComponent;
  let fixture: ComponentFixture<GenerationreglementlivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerationreglementlivraisonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerationreglementlivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

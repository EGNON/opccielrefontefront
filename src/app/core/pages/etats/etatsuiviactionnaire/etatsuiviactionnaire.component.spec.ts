import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatsuiviactionnaireComponent } from './etatsuiviactionnaire.component';

describe('EtatsuiviactionnaireComponent', () => {
  let component: EtatsuiviactionnaireComponent;
  let fixture: ComponentFixture<EtatsuiviactionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtatsuiviactionnaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtatsuiviactionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

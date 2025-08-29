import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueactionnaireComponent } from './historiqueactionnaire.component';

describe('HistoriqueactionnaireComponent', () => {
  let component: HistoriqueactionnaireComponent;
  let fixture: ComponentFixture<HistoriqueactionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoriqueactionnaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueactionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

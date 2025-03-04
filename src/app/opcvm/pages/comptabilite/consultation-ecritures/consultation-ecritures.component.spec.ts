import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationEcrituresComponent } from './consultation-ecritures.component';

describe('ConsultationEcrituresComponent', () => {
  let component: ConsultationEcrituresComponent;
  let fixture: ComponentFixture<ConsultationEcrituresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultationEcrituresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationEcrituresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

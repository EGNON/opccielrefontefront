import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatsuiviclientComponent } from './etatsuiviclient.component';

describe('EtatsuiviclientComponent', () => {
  let component: EtatsuiviclientComponent;
  let fixture: ComponentFixture<EtatsuiviclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtatsuiviclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtatsuiviclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

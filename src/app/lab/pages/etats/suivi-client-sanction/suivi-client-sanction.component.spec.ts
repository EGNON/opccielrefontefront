import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviClientSanctionComponent } from './suivi-client-sanction.component';

describe('SuiviClientSanctionComponent', () => {
  let component: SuiviClientSanctionComponent;
  let fixture: ComponentFixture<SuiviClientSanctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuiviClientSanctionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuiviClientSanctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

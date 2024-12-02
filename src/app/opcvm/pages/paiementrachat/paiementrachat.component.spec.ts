import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementrachatComponent } from './paiementrachat.component';

describe('PaiementrachatComponent', () => {
  let component: PaiementrachatComponent;
  let fixture: ComponentFixture<PaiementrachatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaiementrachatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementrachatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

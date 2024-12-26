import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisSouscriptionComponent } from './avis-souscription.component';

describe('AvisSouscriptionComponent', () => {
  let component: AvisSouscriptionComponent;
  let fixture: ComponentFixture<AvisSouscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvisSouscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisSouscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

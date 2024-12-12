import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisrachatComponent } from './avisrachat.component';

describe('AvisrachatComponent', () => {
  let component: AvisrachatComponent;
  let fixture: ComponentFixture<AvisrachatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvisrachatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisrachatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

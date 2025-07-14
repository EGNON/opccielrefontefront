import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldecompteextourneComponent } from './soldecompteextourne.component';

describe('SoldecompteextourneComponent', () => {
  let component: SoldecompteextourneComponent;
  let fixture: ComponentFixture<SoldecompteextourneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoldecompteextourneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoldecompteextourneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

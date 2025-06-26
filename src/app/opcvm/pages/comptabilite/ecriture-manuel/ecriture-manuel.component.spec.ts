import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcritureManuelComponent } from './ecriture-manuel.component';

describe('EcritureManuelComponent', () => {
  let component: EcritureManuelComponent;
  let fixture: ComponentFixture<EcritureManuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcritureManuelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcritureManuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

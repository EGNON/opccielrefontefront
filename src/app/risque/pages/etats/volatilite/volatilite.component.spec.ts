import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolatiliteComponent } from './volatilite.component';

describe('VolatiliteComponent', () => {
  let component: VolatiliteComponent;
  let fixture: ComponentFixture<VolatiliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolatiliteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolatiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Opcvm1Component } from './opcvm1.component';

describe('Opcvm1Component', () => {
  let component: Opcvm1Component;
  let fixture: ComponentFixture<Opcvm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Opcvm1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Opcvm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

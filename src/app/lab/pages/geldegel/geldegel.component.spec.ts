import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeldegelComponent } from './geldegel.component';

describe('GeldegelComponent', () => {
  let component: GeldegelComponent;
  let fixture: ComponentFixture<GeldegelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeldegelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeldegelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

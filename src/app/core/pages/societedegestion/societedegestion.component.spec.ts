import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietedegestionComponent } from './societedegestion.component';

describe('SocietedegestionComponent', () => {
  let component: SocietedegestionComponent;
  let fixture: ComponentFixture<SocietedegestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocietedegestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocietedegestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbenchmarkComponent } from './navbenchmark.component';

describe('NavbenchmarkComponent', () => {
  let component: NavbenchmarkComponent;
  let fixture: ComponentFixture<NavbenchmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbenchmarkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbenchmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

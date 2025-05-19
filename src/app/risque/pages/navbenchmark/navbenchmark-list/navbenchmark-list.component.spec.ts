import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbenchmarkListComponent } from './navbenchmark-list.component';

describe('NavbenchmarkListComponent', () => {
  let component: NavbenchmarkListComponent;
  let fixture: ComponentFixture<NavbenchmarkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbenchmarkListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbenchmarkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

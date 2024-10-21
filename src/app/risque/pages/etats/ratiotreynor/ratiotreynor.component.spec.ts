import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatiotreynorComponent } from './ratiotreynor.component';

describe('RatiotreynorComponent', () => {
  let component: RatiotreynorComponent;
  let fixture: ComponentFixture<RatiotreynorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatiotreynorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatiotreynorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatiosharpComponent } from './ratiosharp.component';

describe('RatiosharpComponent', () => {
  let component: RatiosharpComponent;
  let fixture: ComponentFixture<RatiosharpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatiosharpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatiosharpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheclientComponent } from './ficheclient.component';

describe('FicheclientComponent', () => {
  let component: FicheclientComponent;
  let fixture: ComponentFixture<FicheclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FicheclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FicheclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

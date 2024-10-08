import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovarianceComponent } from './covariance.component';

describe('CovarianceComponent', () => {
  let component: CovarianceComponent;
  let fixture: ComponentFixture<CovarianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CovarianceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CovarianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationdifferenceestimationComponent } from './generationdifferenceestimation.component';

describe('GenerationdifferenceestimationComponent', () => {
  let component: GenerationdifferenceestimationComponent;
  let fixture: ComponentFixture<GenerationdifferenceestimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerationdifferenceestimationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerationdifferenceestimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

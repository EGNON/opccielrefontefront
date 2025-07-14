import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationdifferenceestimationListComponent } from './generationdifferenceestimation-list.component';

describe('GenerationdifferenceestimationListComponent', () => {
  let component: GenerationdifferenceestimationListComponent;
  let fixture: ComponentFixture<GenerationdifferenceestimationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerationdifferenceestimationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerationdifferenceestimationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

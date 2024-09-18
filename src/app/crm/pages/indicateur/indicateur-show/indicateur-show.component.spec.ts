import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicateurShowComponent } from './indicateur-show.component';

describe('IndicateurShowComponent', () => {
  let component: IndicateurShowComponent;
  let fixture: ComponentFixture<IndicateurShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicateurShowComponent]
    });
    fixture = TestBed.createComponent(IndicateurShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

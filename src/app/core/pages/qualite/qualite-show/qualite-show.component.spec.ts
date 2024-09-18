import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualiteShowComponent } from './qualite-show.component';

describe('QualiteShowComponent', () => {
  let component: QualiteShowComponent;
  let fixture: ComponentFixture<QualiteShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QualiteShowComponent]
    });
    fixture = TestBed.createComponent(QualiteShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

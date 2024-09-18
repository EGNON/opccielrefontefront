import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelemsgalerteComponent } from './modelemsgalerte.component';

describe('ModelemsgalerteComponent', () => {
  let component: ModelemsgalerteComponent;
  let fixture: ComponentFixture<ModelemsgalerteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelemsgalerteComponent]
    });
    fixture = TestBed.createComponent(ModelemsgalerteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

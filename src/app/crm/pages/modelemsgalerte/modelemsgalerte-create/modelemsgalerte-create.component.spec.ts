import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelemsgalerteCreateComponent } from './modelemsgalerte-create.component';

describe('ModelemsgalerteCreateComponent', () => {
  let component: ModelemsgalerteCreateComponent;
  let fixture: ComponentFixture<ModelemsgalerteCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelemsgalerteCreateComponent]
    });
    fixture = TestBed.createComponent(ModelemsgalerteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

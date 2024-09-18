import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelemsgalerteListComponent } from './modelemsgalerte-list.component';

describe('ModelemsgalerteListComponent', () => {
  let component: ModelemsgalerteListComponent;
  let fixture: ComponentFixture<ModelemsgalerteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelemsgalerteListComponent]
    });
    fixture = TestBed.createComponent(ModelemsgalerteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

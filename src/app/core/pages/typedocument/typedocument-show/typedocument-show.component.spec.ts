import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedocumentShowComponent } from './typedocument-show.component';

describe('TypedocumentShowComponent', () => {
  let component: TypedocumentShowComponent;
  let fixture: ComponentFixture<TypedocumentShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypedocumentShowComponent]
    });
    fixture = TestBed.createComponent(TypedocumentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

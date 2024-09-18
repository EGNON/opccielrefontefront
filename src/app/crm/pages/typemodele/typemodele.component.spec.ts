import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypemodeleComponent } from './typemodele.component';

describe('TypemodeleComponent', () => {
  let component: TypemodeleComponent;
  let fixture: ComponentFixture<TypemodeleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypemodeleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypemodeleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeactionComponent } from './typeaction.component';

describe('TypeactionComponent', () => {
  let component: TypeactionComponent;
  let fixture: ComponentFixture<TypeactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

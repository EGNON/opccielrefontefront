import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeevenementComponent } from './typeevenement.component';

describe('TypeevenementComponent', () => {
  let component: TypeevenementComponent;
  let fixture: ComponentFixture<TypeevenementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeevenementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeevenementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

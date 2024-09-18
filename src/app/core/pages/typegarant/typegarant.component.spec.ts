import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypegarantComponent } from './typegarant.component';

describe('TypegarantComponent', () => {
  let component: TypegarantComponent;
  let fixture: ComponentFixture<TypegarantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypegarantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypegarantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypecompteComponent } from './typecompte.component';

describe('TypecompteComponent', () => {
  let component: TypecompteComponent;
  let fixture: ComponentFixture<TypecompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypecompteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypecompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

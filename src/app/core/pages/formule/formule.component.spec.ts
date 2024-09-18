import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormuleComponent } from './formule.component';

describe('FormuleComponent', () => {
  let component: FormuleComponent;
  let fixture: ComponentFixture<FormuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

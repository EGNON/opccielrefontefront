import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormejuridiqueComponent } from './formejuridique.component';

describe('FormejuridiqueComponent', () => {
  let component: FormejuridiqueComponent;
  let fixture: ComponentFixture<FormejuridiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormejuridiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormejuridiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

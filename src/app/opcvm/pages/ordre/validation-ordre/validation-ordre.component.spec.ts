import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationOrdreComponent } from './validation-ordre.component';

describe('ValidationOrdreComponent', () => {
  let component: ValidationOrdreComponent;
  let fixture: ComponentFixture<ValidationOrdreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationOrdreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidationOrdreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

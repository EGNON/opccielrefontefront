import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormejuridiqueListComponent } from './formejuridique-list.component';

describe('FormejuridiqueListComponent', () => {
  let component: FormejuridiqueListComponent;
  let fixture: ComponentFixture<FormejuridiqueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormejuridiqueListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormejuridiqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

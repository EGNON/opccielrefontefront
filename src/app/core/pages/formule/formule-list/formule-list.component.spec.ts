import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormuleListComponent } from './formule-list.component';

describe('FormuleListComponent', () => {
  let component: FormuleListComponent;
  let fixture: ComponentFixture<FormuleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormuleListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

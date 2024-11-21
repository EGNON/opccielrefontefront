import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationniveau2Component } from './verificationniveau2.component';

describe('Verificationniveau2Component', () => {
  let component: Verificationniveau2Component;
  let fixture: ComponentFixture<Verificationniveau2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationniveau2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationniveau2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

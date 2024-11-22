import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationniveau2ListComponent } from './verificationniveau2-list.component';

describe('Verificationniveau2ListComponent', () => {
  let component: Verificationniveau2ListComponent;
  let fixture: ComponentFixture<Verificationniveau2ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationniveau2ListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationniveau2ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

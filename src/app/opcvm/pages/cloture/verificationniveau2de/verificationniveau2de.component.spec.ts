import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationniveau2deComponent } from './verificationniveau2de.component';

describe('Verificationniveau2deComponent', () => {
  let component: Verificationniveau2deComponent;
  let fixture: ComponentFixture<Verificationniveau2deComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationniveau2deComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationniveau2deComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

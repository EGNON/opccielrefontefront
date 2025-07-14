import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationniveau1deComponent } from './verificationniveau1de.component';

describe('Verificationniveau1deComponent', () => {
  let component: Verificationniveau1deComponent;
  let fixture: ComponentFixture<Verificationniveau1deComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationniveau1deComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationniveau1deComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

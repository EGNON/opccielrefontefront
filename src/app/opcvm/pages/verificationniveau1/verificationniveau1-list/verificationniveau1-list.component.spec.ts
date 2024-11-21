import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationniveau1ListComponent } from './verificationniveau1-list.component';

describe('Verificationniveau1ListComponent', () => {
  let component: Verificationniveau1ListComponent;
  let fixture: ComponentFixture<Verificationniveau1ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationniveau1ListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationniveau1ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

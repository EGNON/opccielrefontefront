import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationecritureniveau1deComponent } from './verificationecritureniveau1de.component';

describe('Verificationecritureniveau1deComponent', () => {
  let component: Verificationecritureniveau1deComponent;
  let fixture: ComponentFixture<Verificationecritureniveau1deComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationecritureniveau1deComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationecritureniveau1deComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

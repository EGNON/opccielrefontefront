import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationecritureniveau2deComponent } from './verificationecritureniveau2de.component';

describe('Verificationecritureniveau2deComponent', () => {
  let component: Verificationecritureniveau2deComponent;
  let fixture: ComponentFixture<Verificationecritureniveau2deComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationecritureniveau2deComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationecritureniveau2deComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

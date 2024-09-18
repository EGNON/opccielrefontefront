import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcvmComponent } from './opcvm.component';

describe('OpcvmComponent', () => {
  let component: OpcvmComponent;
  let fixture: ComponentFixture<OpcvmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpcvmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpcvmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

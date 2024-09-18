import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcvmShowComponent } from './opcvm-show.component';

describe('OpcvmShowComponent', () => {
  let component: OpcvmShowComponent;
  let fixture: ComponentFixture<OpcvmShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpcvmShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpcvmShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemedinformationComponent } from './systemedinformation.component';

describe('SystemedinformationComponent', () => {
  let component: SystemedinformationComponent;
  let fixture: ComponentFixture<SystemedinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemedinformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemedinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

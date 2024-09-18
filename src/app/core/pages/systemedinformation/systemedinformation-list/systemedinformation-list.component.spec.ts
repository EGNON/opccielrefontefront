import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemedinformationListComponent } from './systemedinformation-list.component';

describe('SystemedinformationListComponent', () => {
  let component: SystemedinformationListComponent;
  let fixture: ComponentFixture<SystemedinformationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemedinformationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemedinformationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

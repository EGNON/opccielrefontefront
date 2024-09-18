import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcvmListComponent } from './opcvm-list.component';

describe('OpcvmListComponent', () => {
  let component: OpcvmListComponent;
  let fixture: ComponentFixture<OpcvmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpcvmListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpcvmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

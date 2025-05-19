import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbenchmarkAddEditComponent } from './navbenchmark-add-edit.component';

describe('NavbenchmarkAddEditComponent', () => {
  let component: NavbenchmarkAddEditComponent;
  let fixture: ComponentFixture<NavbenchmarkAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbenchmarkAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbenchmarkAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionnaireopcvmComponent } from './actionnaireopcvm.component';

describe('ActionnaireopcvmComponent', () => {
  let component: ActionnaireopcvmComponent;
  let fixture: ComponentFixture<ActionnaireopcvmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionnaireopcvmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionnaireopcvmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

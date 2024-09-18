import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionnaireopcvmListComponent } from './actionnaireopcvm-list.component';

describe('ActionnaireopcvmListComponent', () => {
  let component: ActionnaireopcvmListComponent;
  let fixture: ComponentFixture<ActionnaireopcvmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionnaireopcvmListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionnaireopcvmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

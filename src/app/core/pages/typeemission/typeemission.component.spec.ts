import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeemissionComponent } from './typeemission.component';

describe('TypeemissionComponent', () => {
  let component: TypeemissionComponent;
  let fixture: ComponentFixture<TypeemissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeemissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeemissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

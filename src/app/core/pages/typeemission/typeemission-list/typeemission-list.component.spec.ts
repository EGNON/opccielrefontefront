import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeemissionListComponent } from './typeemission-list.component';

describe('TypeemissionListComponent', () => {
  let component: TypeemissionListComponent;
  let fixture: ComponentFixture<TypeemissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeemissionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeemissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeactionListComponent } from './typeaction-list.component';

describe('TypeactionListComponent', () => {
  let component: TypeactionListComponent;
  let fixture: ComponentFixture<TypeactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeactionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

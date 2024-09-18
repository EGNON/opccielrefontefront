import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypecompteListComponent } from './typecompte-list.component';

describe('TypecompteListComponent', () => {
  let component: TypecompteListComponent;
  let fixture: ComponentFixture<TypecompteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypecompteListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypecompteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

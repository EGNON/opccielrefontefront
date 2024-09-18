import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypemodeleListComponent } from './typemodele-list.component';

describe('TypemodeleListComponent', () => {
  let component: TypemodeleListComponent;
  let fixture: ComponentFixture<TypemodeleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypemodeleListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypemodeleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

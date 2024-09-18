import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeoperationListComponent } from './typeoperation-list.component';

describe('TypeoperationListComponent', () => {
  let component: TypeoperationListComponent;
  let fixture: ComponentFixture<TypeoperationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeoperationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeoperationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeevenementListComponent } from './typeevenement-list.component';

describe('TypeevenementListComponent', () => {
  let component: TypeevenementListComponent;
  let fixture: ComponentFixture<TypeevenementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeevenementListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeevenementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

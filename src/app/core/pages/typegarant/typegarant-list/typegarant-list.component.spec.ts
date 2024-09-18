import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypegarantListComponent } from './typegarant-list.component';

describe('TypegarantListComponent', () => {
  let component: TypegarantListComponent;
  let fixture: ComponentFixture<TypegarantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypegarantListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypegarantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

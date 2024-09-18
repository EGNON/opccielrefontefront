import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeemetteurListComponent } from './typeemetteur-list.component';

describe('TypeemetteurListComponent', () => {
  let component: TypeemetteurListComponent;
  let fixture: ComponentFixture<TypeemetteurListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeemetteurListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeemetteurListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

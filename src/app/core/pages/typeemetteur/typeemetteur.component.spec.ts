import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeemetteurComponent } from './typeemetteur.component';

describe('TypeemetteurComponent', () => {
  let component: TypeemetteurComponent;
  let fixture: ComponentFixture<TypeemetteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeemetteurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeemetteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

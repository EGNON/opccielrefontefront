import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Circulaire8AddEditComponent } from './circulaire8-add-edit.component';

describe('Circulaire8AddEditComponent', () => {
  let component: Circulaire8AddEditComponent;
  let fixture: ComponentFixture<Circulaire8AddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Circulaire8AddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Circulaire8AddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

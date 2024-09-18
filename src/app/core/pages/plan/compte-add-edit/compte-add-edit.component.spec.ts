import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteAddEditComponent } from './compte-add-edit.component';

describe('CompteAddEditComponent', () => {
  let component: CompteAddEditComponent;
  let fixture: ComponentFixture<CompteAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompteAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompteAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

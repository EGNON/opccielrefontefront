import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeleecritureAddEditComponent } from './modeleecriture-add-edit.component';

describe('ModeleecritureAddEditComponent', () => {
  let component: ModeleecritureAddEditComponent;
  let fixture: ComponentFixture<ModeleecritureAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeleecritureAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeleecritureAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

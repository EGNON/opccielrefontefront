import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeleformuleAddEditComponent } from './modeleformule-add-edit.component';

describe('ModeleformuleAddEditComponent', () => {
  let component: ModeleformuleAddEditComponent;
  let fixture: ComponentFixture<ModeleformuleAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeleformuleAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeleformuleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

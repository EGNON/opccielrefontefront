import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptecomptableAddEditComponent } from './comptecomptable-add-edit.component';

describe('ComptecomptableAddEditComponent', () => {
  let component: ComptecomptableAddEditComponent;
  let fixture: ComponentFixture<ComptecomptableAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComptecomptableAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComptecomptableAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecteurboursierAddEditComponent } from './secteurboursier-add-edit.component';

describe('SecteurboursierAddEditComponent', () => {
  let component: SecteurboursierAddEditComponent;
  let fixture: ComponentFixture<SecteurboursierAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecteurboursierAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecteurboursierAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscategorieAddEditComponent } from './souscategorie-add-edit.component';

describe('SouscategorieAddEditComponent', () => {
  let component: SouscategorieAddEditComponent;
  let fixture: ComponentFixture<SouscategorieAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SouscategorieAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SouscategorieAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

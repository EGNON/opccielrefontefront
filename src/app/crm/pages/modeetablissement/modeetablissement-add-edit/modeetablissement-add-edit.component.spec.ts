import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeetablissementAddEditComponent } from './modeetablissement-add-edit.component';

describe('ModeetablissementAddEditComponent', () => {
  let component: ModeetablissementAddEditComponent;
  let fixture: ComponentFixture<ModeetablissementAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeetablissementAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeetablissementAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

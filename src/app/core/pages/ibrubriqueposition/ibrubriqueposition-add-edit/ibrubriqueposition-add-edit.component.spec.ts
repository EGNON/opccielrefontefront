import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbrubriquepositionAddEditComponent } from './ibrubriqueposition-add-edit.component';

describe('IbrubriquepositionAddEditComponent', () => {
  let component: IbrubriquepositionAddEditComponent;
  let fixture: ComponentFixture<IbrubriquepositionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IbrubriquepositionAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IbrubriquepositionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbrubriquepositionListComponent } from './ibrubriqueposition-list.component';

describe('IbrubriquepositionListComponent', () => {
  let component: IbrubriquepositionListComponent;
  let fixture: ComponentFixture<IbrubriquepositionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IbrubriquepositionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IbrubriquepositionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

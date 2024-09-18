import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbrubriquepositionComponent } from './ibrubriqueposition.component';

describe('IbrubriquepositionComponent', () => {
  let component: IbrubriquepositionComponent;
  let fixture: ComponentFixture<IbrubriquepositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IbrubriquepositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IbrubriquepositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

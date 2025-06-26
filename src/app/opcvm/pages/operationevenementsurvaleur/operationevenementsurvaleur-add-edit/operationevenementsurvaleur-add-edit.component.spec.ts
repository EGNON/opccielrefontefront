import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationevenementsurvaleurAddEditComponent } from './operationevenementsurvaleur-add-edit.component';

describe('OperationevenementsurvaleurAddEditComponent', () => {
  let component: OperationevenementsurvaleurAddEditComponent;
  let fixture: ComponentFixture<OperationevenementsurvaleurAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationevenementsurvaleurAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationevenementsurvaleurAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

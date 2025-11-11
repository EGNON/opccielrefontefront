import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciceAddEdit } from './exercice-add-edit';

describe('ExerciceAddEdit', () => {
  let component: ExerciceAddEdit;
  let fixture: ComponentFixture<ExerciceAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExerciceAddEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciceAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

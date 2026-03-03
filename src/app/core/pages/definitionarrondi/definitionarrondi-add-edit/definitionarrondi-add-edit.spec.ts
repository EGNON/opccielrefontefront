import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionarrondiAddEdit } from './definitionarrondi-add-edit';

describe('DefinitionarrondiAddEdit', () => {
  let component: DefinitionarrondiAddEdit;
  let fixture: ComponentFixture<DefinitionarrondiAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefinitionarrondiAddEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefinitionarrondiAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

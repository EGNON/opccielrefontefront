import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionarrondiList } from './definitionarrondi-list';

describe('DefinitionarrondiList', () => {
  let component: DefinitionarrondiList;
  let fixture: ComponentFixture<DefinitionarrondiList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefinitionarrondiList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefinitionarrondiList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrejoursferiesAddEdit } from './parametrejoursferies-add-edit';

describe('ParametrejoursferiesAddEdit', () => {
  let component: ParametrejoursferiesAddEdit;
  let fixture: ComponentFixture<ParametrejoursferiesAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParametrejoursferiesAddEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametrejoursferiesAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

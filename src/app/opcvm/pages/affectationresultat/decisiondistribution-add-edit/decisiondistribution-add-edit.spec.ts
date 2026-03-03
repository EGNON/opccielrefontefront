import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisiondistributionAddEdit } from './decisiondistribution-add-edit';

describe('DecisiondistributionAddEdit', () => {
  let component: DecisiondistributionAddEdit;
  let fixture: ComponentFixture<DecisiondistributionAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DecisiondistributionAddEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisiondistributionAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

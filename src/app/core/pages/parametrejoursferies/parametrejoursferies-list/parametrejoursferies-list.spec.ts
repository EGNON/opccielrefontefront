import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrejoursferiesList } from './parametrejoursferies-list';

describe('ParametrejoursferiesList', () => {
  let component: ParametrejoursferiesList;
  let fixture: ComponentFixture<ParametrejoursferiesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParametrejoursferiesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametrejoursferiesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

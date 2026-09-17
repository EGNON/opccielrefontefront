import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctiononuList } from './sanctiononu-list';

describe('SanctiononuList', () => {
  let component: SanctiononuList;
  let fixture: ComponentFixture<SanctiononuList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SanctiononuList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctiononuList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Parametrejoursferies } from './parametrejoursferies';

describe('Parametrejoursferies', () => {
  let component: Parametrejoursferies;
  let fixture: ComponentFixture<Parametrejoursferies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Parametrejoursferies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Parametrejoursferies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

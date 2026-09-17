import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sanctiononu } from './sanctiononu';

describe('Sanctiononu', () => {
  let component: Sanctiononu;
  let fixture: ComponentFixture<Sanctiononu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sanctiononu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sanctiononu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

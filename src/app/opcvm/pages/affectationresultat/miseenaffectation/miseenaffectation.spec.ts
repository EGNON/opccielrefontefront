import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Miseenaffectation } from './miseenaffectation';

describe('Miseenaffectation', () => {
  let component: Miseenaffectation;
  let fixture: ComponentFixture<Miseenaffectation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Miseenaffectation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Miseenaffectation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

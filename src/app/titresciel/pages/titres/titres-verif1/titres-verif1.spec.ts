import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitresVerif1 } from './titres-verif1';

describe('TitresVerif1', () => {
  let component: TitresVerif1;
  let fixture: ComponentFixture<TitresVerif1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitresVerif1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitresVerif1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

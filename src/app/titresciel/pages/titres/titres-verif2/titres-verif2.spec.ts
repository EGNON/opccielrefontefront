import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitresVerif2 } from './titres-verif2';

describe('TitresVerif2', () => {
  let component: TitresVerif2;
  let fixture: ComponentFixture<TitresVerif2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitresVerif2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitresVerif2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

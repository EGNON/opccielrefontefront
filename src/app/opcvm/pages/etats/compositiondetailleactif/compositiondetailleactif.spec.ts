import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compositiondetailleactif } from './compositiondetailleactif';

describe('Compositiondetailleactif', () => {
  let component: Compositiondetailleactif;
  let fixture: ComponentFixture<Compositiondetailleactif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Compositiondetailleactif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Compositiondetailleactif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

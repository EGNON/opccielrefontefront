import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Evolutionvl } from './evolutionvl';

describe('Evolutionvl', () => {
  let component: Evolutionvl;
  let fixture: ComponentFixture<Evolutionvl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Evolutionvl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Evolutionvl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

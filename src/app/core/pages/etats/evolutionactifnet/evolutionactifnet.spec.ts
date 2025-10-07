import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Evolutionactifnet } from './evolutionactifnet';

describe('Evolutionactifnet', () => {
  let component: Evolutionactifnet;
  let fixture: ComponentFixture<Evolutionactifnet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Evolutionactifnet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Evolutionactifnet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

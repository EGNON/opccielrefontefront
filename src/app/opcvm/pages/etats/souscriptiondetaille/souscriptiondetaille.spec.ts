import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Souscriptiondetaille } from './souscriptiondetaille';

describe('Souscriptiondetaille', () => {
  let component: Souscriptiondetaille;
  let fixture: ComponentFixture<Souscriptiondetaille>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Souscriptiondetaille]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Souscriptiondetaille);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

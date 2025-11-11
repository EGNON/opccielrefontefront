import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Souscriptionglobal } from './souscriptionglobal';

describe('Souscriptionglobal', () => {
  let component: Souscriptionglobal;
  let fixture: ComponentFixture<Souscriptionglobal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Souscriptionglobal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Souscriptionglobal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

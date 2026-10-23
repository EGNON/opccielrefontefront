import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Historiquevl } from './historiquevl';

describe('Historiquevl', () => {
  let component: Historiquevl;
  let fixture: ComponentFixture<Historiquevl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Historiquevl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Historiquevl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

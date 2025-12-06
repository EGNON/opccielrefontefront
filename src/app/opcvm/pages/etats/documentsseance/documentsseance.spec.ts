import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Documentsseance } from './documentsseance';

describe('Documentsseance', () => {
  let component: Documentsseance;
  let fixture: ComponentFixture<Documentsseance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Documentsseance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Documentsseance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

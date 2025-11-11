import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Relevepartactionnaire } from './relevepartactionnaire';

describe('Relevepartactionnaire', () => {
  let component: Relevepartactionnaire;
  let fixture: ComponentFixture<Relevepartactionnaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Relevepartactionnaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Relevepartactionnaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

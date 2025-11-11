import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Relevepartfcp } from './relevepartfcp';

describe('Relevepartfcp', () => {
  let component: Relevepartfcp;
  let fixture: ComponentFixture<Relevepartfcp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Relevepartfcp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Relevepartfcp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

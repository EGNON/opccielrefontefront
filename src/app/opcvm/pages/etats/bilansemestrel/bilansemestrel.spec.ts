import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bilansemestrel } from './bilansemestrel';

describe('Bilansemestrel', () => {
  let component: Bilansemestrel;
  let fixture: ComponentFixture<Bilansemestrel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Bilansemestrel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bilansemestrel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

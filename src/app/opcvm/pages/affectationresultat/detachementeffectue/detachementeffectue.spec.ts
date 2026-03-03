import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detachementeffectue } from './detachementeffectue';

describe('Detachementeffectue', () => {
  let component: Detachementeffectue;
  let fixture: ComponentFixture<Detachementeffectue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Detachementeffectue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detachementeffectue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

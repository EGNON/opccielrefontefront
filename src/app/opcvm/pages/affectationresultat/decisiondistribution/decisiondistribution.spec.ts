import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Decisiondistribution } from './decisiondistribution';

describe('Decisiondistribution', () => {
  let component: Decisiondistribution;
  let fixture: ComponentFixture<Decisiondistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Decisiondistribution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Decisiondistribution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

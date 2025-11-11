import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Soldecomptecomtable } from './soldecomptecomtable';

describe('Soldecomptecomtable', () => {
  let component: Soldecomptecomtable;
  let fixture: ComponentFixture<Soldecomptecomtable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Soldecomptecomtable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Soldecomptecomtable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

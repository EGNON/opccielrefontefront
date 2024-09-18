import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifAtteintListComponent } from './objectif-atteint-list.component';

describe('ObjectifAtteintListComponent', () => {
  let component: ObjectifAtteintListComponent;
  let fixture: ComponentFixture<ObjectifAtteintListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectifAtteintListComponent]
    });
    fixture = TestBed.createComponent(ObjectifAtteintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

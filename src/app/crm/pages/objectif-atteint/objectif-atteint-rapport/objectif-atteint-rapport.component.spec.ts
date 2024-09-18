import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifAtteintRapportComponent } from './objectif-atteint-rapport.component';

describe('ObjectifAtteintRapportComponent', () => {
  let component: ObjectifAtteintRapportComponent;
  let fixture: ComponentFixture<ObjectifAtteintRapportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectifAtteintRapportComponent]
    });
    fixture = TestBed.createComponent(ObjectifAtteintRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

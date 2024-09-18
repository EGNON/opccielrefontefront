import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifAtteintComponent } from './objectif-atteint.component';

describe('ObjectifAtteintComponent', () => {
  let component: ObjectifAtteintComponent;
  let fixture: ComponentFixture<ObjectifAtteintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectifAtteintComponent]
    });
    fixture = TestBed.createComponent(ObjectifAtteintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

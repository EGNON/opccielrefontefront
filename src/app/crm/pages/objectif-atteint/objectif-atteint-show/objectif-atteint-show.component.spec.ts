import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifAtteintShowComponent } from './objectif-atteint-show.component';

describe('ObjectifAtteintShowComponent', () => {
  let component: ObjectifAtteintShowComponent;
  let fixture: ComponentFixture<ObjectifAtteintShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectifAtteintShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObjectifAtteintShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

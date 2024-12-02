import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestitutionReliquatComponent } from './restitution-reliquat.component';

describe('RestitutionReliquatComponent', () => {
  let component: RestitutionReliquatComponent;
  let fixture: ComponentFixture<RestitutionReliquatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestitutionReliquatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestitutionReliquatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

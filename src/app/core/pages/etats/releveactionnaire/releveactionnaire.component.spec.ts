import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleveactionnaireComponent } from './releveactionnaire.component';

describe('ReleveactionnaireComponent', () => {
  let component: ReleveactionnaireComponent;
  let fixture: ComponentFixture<ReleveactionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReleveactionnaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReleveactionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

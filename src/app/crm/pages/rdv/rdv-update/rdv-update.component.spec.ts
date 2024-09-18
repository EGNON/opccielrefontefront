import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvUpdateComponent } from './rdv-update.component';

describe('RdvUpdateComponent', () => {
  let component: RdvUpdateComponent;
  let fixture: ComponentFixture<RdvUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RdvUpdateComponent]
    });
    fixture = TestBed.createComponent(RdvUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

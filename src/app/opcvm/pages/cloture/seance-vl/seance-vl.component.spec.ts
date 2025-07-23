import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeanceVLComponent } from './seance-vl.component';

describe('SeanceVLComponent', () => {
  let component: SeanceVLComponent;
  let fixture: ComponentFixture<SeanceVLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeanceVLComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeanceVLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

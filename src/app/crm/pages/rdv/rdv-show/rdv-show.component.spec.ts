import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvShowComponent } from './rdv-show.component';

describe('RdvShowComponent', () => {
  let component: RdvShowComponent;
  let fixture: ComponentFixture<RdvShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RdvShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RdvShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

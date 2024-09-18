import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaysShowComponent } from './pays-show.component';

describe('PaysShowComponent', () => {
  let component: PaysShowComponent;
  let fixture: ComponentFixture<PaysShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaysShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaysShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

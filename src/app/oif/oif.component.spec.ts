import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OifComponent } from './oif.component';

describe('OifComponent', () => {
  let component: OifComponent;
  let fixture: ComponentFixture<OifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

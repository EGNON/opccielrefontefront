import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureevenementComponent } from './natureevenement.component';

describe('NatureevenementComponent', () => {
  let component: NatureevenementComponent;
  let fixture: ComponentFixture<NatureevenementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NatureevenementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NatureevenementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

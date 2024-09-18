import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoustypeactionComponent } from './soustypeaction.component';

describe('SoustypeactionComponent', () => {
  let component: SoustypeactionComponent;
  let fixture: ComponentFixture<SoustypeactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoustypeactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoustypeactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

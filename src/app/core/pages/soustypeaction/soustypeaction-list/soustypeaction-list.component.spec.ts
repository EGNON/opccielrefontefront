import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoustypeactionListComponent } from './soustypeaction-list.component';

describe('SoustypeactionListComponent', () => {
  let component: SoustypeactionListComponent;
  let fixture: ComponentFixture<SoustypeactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoustypeactionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoustypeactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

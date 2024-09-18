import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoustypecompteListComponent } from './soustypecompte-list.component';

describe('SoustypecompteListComponent', () => {
  let component: SoustypecompteListComponent;
  let fixture: ComponentFixture<SoustypecompteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoustypecompteListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoustypecompteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

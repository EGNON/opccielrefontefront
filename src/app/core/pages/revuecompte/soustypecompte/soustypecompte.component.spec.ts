import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoustypecompteComponent } from './soustypecompte.component';

describe('SoustypecompteComponent', () => {
  let component: SoustypecompteComponent;
  let fixture: ComponentFixture<SoustypecompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoustypecompteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoustypecompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

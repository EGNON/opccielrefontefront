import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoustypeclientComponent } from './soustypeclient.component';

describe('SoustypeclientComponent', () => {
  let component: SoustypeclientComponent;
  let fixture: ComponentFixture<SoustypeclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoustypeclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoustypeclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

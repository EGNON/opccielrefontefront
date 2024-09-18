import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoustypeclientListComponent } from './soustypeclient-list.component';

describe('SoustypeclientListComponent', () => {
  let component: SoustypeclientListComponent;
  let fixture: ComponentFixture<SoustypeclientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoustypeclientListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoustypeclientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

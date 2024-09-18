import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoustypeclientAddEditComponent } from './soustypeclient-add-edit.component';

describe('SoustypeclientAddEditComponent', () => {
  let component: SoustypeclientAddEditComponent;
  let fixture: ComponentFixture<SoustypeclientAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoustypeclientAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoustypeclientAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

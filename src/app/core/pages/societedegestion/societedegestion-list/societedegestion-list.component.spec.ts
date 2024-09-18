import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietedegestionListComponent } from './societedegestion-list.component';

describe('SocietedegestionListComponent', () => {
  let component: SocietedegestionListComponent;
  let fixture: ComponentFixture<SocietedegestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocietedegestionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocietedegestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

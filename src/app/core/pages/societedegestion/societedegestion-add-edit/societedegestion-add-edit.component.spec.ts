import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietedegestionAddEditComponent } from './societedegestion-add-edit.component';

describe('SocietedegestionAddEditComponent', () => {
  let component: SocietedegestionAddEditComponent;
  let fixture: ComponentFixture<SocietedegestionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocietedegestionAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocietedegestionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

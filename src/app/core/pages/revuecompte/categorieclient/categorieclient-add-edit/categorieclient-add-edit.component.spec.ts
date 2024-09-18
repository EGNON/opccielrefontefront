import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieclientAddEditComponent } from './categorieclient-add-edit.component';

describe('CategorieclientAddEditComponent', () => {
  let component: CategorieclientAddEditComponent;
  let fixture: ComponentFixture<CategorieclientAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategorieclientAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieclientAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieclientComponent } from './categorieclient.component';

describe('CategorieclientComponent', () => {
  let component: CategorieclientComponent;
  let fixture: ComponentFixture<CategorieclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategorieclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieclientListComponent } from './categorieclient-list.component';

describe('CategorieclientListComponent', () => {
  let component: CategorieclientListComponent;
  let fixture: ComponentFixture<CategorieclientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategorieclientListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieclientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

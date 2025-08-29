import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointtresorerieComponent } from './pointtresorerie.component';

describe('PointtresorerieComponent', () => {
  let component: PointtresorerieComponent;
  let fixture: ComponentFixture<PointtresorerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointtresorerieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointtresorerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

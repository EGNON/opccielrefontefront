import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointtresorerieetatComponent } from './pointtresorerieetat.component';

describe('PointtresorerieetatComponent', () => {
  let component: PointtresorerieetatComponent;
  let fixture: ComponentFixture<PointtresorerieetatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointtresorerieetatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointtresorerieetatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

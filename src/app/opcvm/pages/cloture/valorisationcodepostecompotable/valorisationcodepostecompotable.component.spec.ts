import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorisationcodepostecompotableComponent } from './valorisationcodepostecompotable.component';

describe('ValorisationcodepostecompotableComponent', () => {
  let component: ValorisationcodepostecompotableComponent;
  let fixture: ComponentFixture<ValorisationcodepostecompotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValorisationcodepostecompotableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValorisationcodepostecompotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorisationcodepostecomptablenComponent } from './valorisationcodepostecomptablen.component';

describe('ValorisationcodepostecomptablenComponent', () => {
  let component: ValorisationcodepostecomptablenComponent;
  let fixture: ComponentFixture<ValorisationcodepostecomptablenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValorisationcodepostecomptablenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValorisationcodepostecomptablenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

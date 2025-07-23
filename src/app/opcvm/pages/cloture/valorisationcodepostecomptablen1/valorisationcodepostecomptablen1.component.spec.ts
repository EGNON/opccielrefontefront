import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Valorisationcodepostecomptablen1Component } from './valorisationcodepostecomptablen1.component';

describe('Valorisationcodepostecomptablen1Component', () => {
  let component: Valorisationcodepostecomptablen1Component;
  let fixture: ComponentFixture<Valorisationcodepostecomptablen1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Valorisationcodepostecomptablen1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Valorisationcodepostecomptablen1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

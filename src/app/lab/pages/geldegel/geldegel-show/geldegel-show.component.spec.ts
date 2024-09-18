import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeldegelShowComponent } from './geldegel-show.component';

describe('GeldegelShowComponent', () => {
  let component: GeldegelShowComponent;
  let fixture: ComponentFixture<GeldegelShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeldegelShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeldegelShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

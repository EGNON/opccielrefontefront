import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeldegelListComponent } from './geldegel-list.component';

describe('GeldegelListComponent', () => {
  let component: GeldegelListComponent;
  let fixture: ComponentFixture<GeldegelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeldegelListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeldegelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

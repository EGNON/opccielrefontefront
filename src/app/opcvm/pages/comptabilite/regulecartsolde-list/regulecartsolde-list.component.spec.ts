import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulecartsoldeListComponent } from './regulecartsolde-list.component';

describe('RegulecartsoldeListComponent', () => {
  let component: RegulecartsoldeListComponent;
  let fixture: ComponentFixture<RegulecartsoldeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegulecartsoldeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegulecartsoldeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

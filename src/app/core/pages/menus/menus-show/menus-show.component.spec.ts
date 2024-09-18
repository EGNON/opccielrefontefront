import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusShowComponent } from './menus-show.component';

describe('MenusShowComponent', () => {
  let component: MenusShowComponent;
  let fixture: ComponentFixture<MenusShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenusShowComponent]
    });
    fixture = TestBed.createComponent(MenusShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

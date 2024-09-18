import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusAddEditComponent } from './menus-add-edit.component';

describe('MenusAddEditComponent', () => {
  let component: MenusAddEditComponent;
  let fixture: ComponentFixture<MenusAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenusAddEditComponent]
    });
    fixture = TestBed.createComponent(MenusAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

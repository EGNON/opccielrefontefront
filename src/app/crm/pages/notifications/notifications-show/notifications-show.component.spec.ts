import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsShowComponent } from './notifications-show.component';

describe('NotificationsShowComponent', () => {
  let component: NotificationsShowComponent;
  let fixture: ComponentFixture<NotificationsShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsShowComponent]
    });
    fixture = TestBed.createComponent(NotificationsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskNotification } from './task-notification';

describe('TaskNotification', () => {
  let component: TaskNotification;
  let fixture: ComponentFixture<TaskNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

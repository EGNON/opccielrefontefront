
import {
    Component,
    ChangeDetectionStrategy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { TaskNotificationService } from '../services/TaskNotificationService';

// import { TaskNotificationService } from '../../services/task-notification.service';

@Component({
    selector: 'app-task-notification',
    standalone: true,
    imports: [CommonModule],
    templateUrl: 'task-notification.html',
    styleUrl: './task-notification.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskNotification {

    notifications$ = this.notificationService.notifications$;

    visible$ = this.notificationService.visible$;

    total$ = this.notificationService.total$;

    constructor(
        public notificationService: TaskNotificationService
    ) {}

    consulter(type: string): void {

        this.notificationService.consulterNotification(type);

    }

    fermer(): void {

        this.notificationService.fermerPopup();

    }
}

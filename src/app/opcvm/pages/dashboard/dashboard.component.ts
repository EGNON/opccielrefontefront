import { Component } from '@angular/core';
import { AuthService } from "../../../core/modules/auth";
import { TaskNotificationService } from '../../../services/TaskNotificationService';
//import { TaskNotificationService } from "core/services/task-notification.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: false
})
export class DashboardComponent {

    constructor(
        private taskNotificationService: TaskNotificationService
    ) {}

    async activerNotifications(): Promise<void> {
        await this.taskNotificationService.activerAbonnementPush();
    }
}
import { Component } from '@angular/core';
import {AuthService} from "../../../core/modules/auth";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: false
})
export class DashboardComponent {
  constructor() {
  }
}

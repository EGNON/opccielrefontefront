import { Component } from '@angular/core';
import {AuthService} from "../../../core/modules/auth";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private authService: AuthService) {
    console.log('DashboardComponent', this.authService.LocalStorageManager.getValue("currentOpcvm"));
  }
}

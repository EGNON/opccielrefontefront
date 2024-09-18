import { Component } from '@angular/core';
import {AuthService, UserType} from "../../../modules/auth";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  currentUser: UserType;
  constructor(private authService: AuthService) {
    this.currentUser = authService.currentUserValue;
  }
}

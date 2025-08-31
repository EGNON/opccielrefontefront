import {Component, HostBinding, Input, OnInit} from '@angular/core';
import icons from "../../../../template/_metronic/shared/keenicon/icons.json";
import {Observable} from "rxjs";

@Component({
    selector: 'app-user-notifications',
    templateUrl: './user-notifications.component.html',
    styleUrls: ['./user-notifications.component.scss'],
    standalone: false
})
export class UserNotificationsComponent implements OnInit {
  @Input() name: string;
  @Input() class: string;
  @Input() type: string = 'duotone';
  @Input() badgeCount: null | number = 0;

  pathsNumber: number = 0;

  constructor() {}

  ngOnInit() {
    if (this.type === 'duotone') {
      // @ts-ignore
      this.pathsNumber = icons[this.type + '-paths'][this.name] ?? 0;
    }
  }

  @HostBinding('style.display')
  get styleDisplay() {
    return 'contents';
  }
}

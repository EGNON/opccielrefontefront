import { Component } from '@angular/core';
import {PageInfoService, PageLink} from "../../../../../template/_metronic/layout";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    standalone: false
})
export class SettingsComponent {
  links: Array<PageLink> = [
    {
      title: 'Main title',
      path: '/',
      isActive: false,
    },
    {
      title: 'Second title',
      path: '/',
      isActive: false,
    }
  ];
  constructor(private pageInfo: PageInfoService) {
    pageInfo.updateTitle('Mon compte');
    // pageInfo.updateBreadcrumbs(this.links);
  }
}

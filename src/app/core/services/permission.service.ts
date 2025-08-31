import {Inject, Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Permission} from "../models/permission";
import {ResourceService} from "../../crm/services/core/resource.service";
import {environment} from "../../../environments/environment";
import {ResponseModel} from "../../crm/models/table.model";

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends ResourceService<Permission> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http, Permission, ``);
    this.API_URL = `${environment.apiUrl}/permissions`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTous() {
    return this.http.get<ResponseModel<any>>(`${this.API_URL}`);
  }
}

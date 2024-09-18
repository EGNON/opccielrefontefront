import {Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {EntityService} from "../entity.service";
import {Menu} from "../../models/access/menu.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {DataTablesResponse} from "../../models/data-tables.response.model";

@Injectable({
  providedIn: 'root'
})
export class MenuService extends EntityService<Menu> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/admin/menus`;
  }

  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Menu>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }

  afficherMenus()
  {
    return this.http.get<Menu[]>(`${this.API_URL}`);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

import {Inject, Injectable, OnDestroy} from '@angular/core';
import {EntityService} from "../entity.service";
import {Role} from "../../models/access/role.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ResourceService} from "../core/resource.service";
import {Degre} from "../../models/degre.model";
import {ResponseModel} from "../../models/table.model";

@Injectable({
  providedIn: 'root'
})
export class RoleService extends ResourceService<Role> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http, Role, ``);
    this.API_URL = `${environment.apiUrl}/roles`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTous() {
    return this.http.get<ResponseModel<any>>(`${this.API_URL}`);
  }

  pagination(request: any) {
    return this.http.post<ResponseModel<any>>(`${this.API_URL}/filter/specification/pagination`, request);
  }

  afficherSelonNom(keyword: string) {
    return this.http.get<ResponseModel<any>>(`${this.API_URL}/nom/${keyword}`)
  }
}

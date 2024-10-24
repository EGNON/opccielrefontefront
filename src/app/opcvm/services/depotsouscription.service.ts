import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../../core/models/opcvm";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DepotsouscriptionService extends ResourceService<any> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Opcvm,`${environment.apiUrl}/depotrachats`);
    this.API_URL = `${environment.apiUrl}/depotrachats`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherListeDepot(datatableRequest: any) {
    return this.http.post<any>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
}

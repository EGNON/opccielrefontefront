import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {HttpClient} from "@angular/common/http";
import {Opcvm} from "../../core/models/opcvm";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OperationCommissionService extends ResourceService<any> implements OnDestroy{
  constructor(
    private http: HttpClient,) {
    super(http,Opcvm,`${environment.apiUrl}/commissionstaxes`);
    this.API_URL = `${environment.apiUrl}/commissionstaxes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherListeCommissions(parameters: any) {
    return this.http.post<any>(`${this.API_URL}/datatable/list`, parameters);
  }

  creerPaiementCom(data: any) {
    return this.http.post<any>(`${this.API_URL}`, data);
  }
}

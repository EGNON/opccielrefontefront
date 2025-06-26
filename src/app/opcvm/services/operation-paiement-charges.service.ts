import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {HttpClient} from "@angular/common/http";
import {Opcvm} from "../../core/models/opcvm";
import {environment} from "../../../environments/environment";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OperationPaiementChargesService extends ResourceService<any> implements OnDestroy{

  constructor(
    private http: HttpClient,) {
    super(http,Opcvm,`${environment.apiUrl}/paiement/charges`);
    this.API_URL = `${environment.apiUrl}/paiement/charges`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherListe(parameters: any) {
    return this.http.post<any>(`${this.API_URL}/datatable/list`, parameters);
  }

  creerPaiementCharge(id:any,data: any) {
    return this.http.post<any>(`${this.API_URL}/${id}`, data)
  }
}

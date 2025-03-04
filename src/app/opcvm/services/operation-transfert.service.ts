import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {HttpClient} from "@angular/common/http";
import {Opcvm} from "../../core/models/opcvm";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OperationTransfertService extends ResourceService<any> implements OnDestroy{
  constructor(
    private http: HttpClient,) {
    super(http,Opcvm,`${environment.apiUrl}/transfertparts`);
    this.API_URL = `${environment.apiUrl}/transfertparts`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherListeTransferts(parameters: any) {
    return this.http.post<any>(`${this.API_URL}/datatable/list`, parameters);
  }

  creerTransfert(parameters: any) {
    return this.http.post<any>(`${this.API_URL}/transfert/parts/save`, parameters);
  }
}

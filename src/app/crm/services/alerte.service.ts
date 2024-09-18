import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Alerte} from "../models/alerte.model";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {EntityService} from "./entity.service";
import {BehaviorSubject} from "rxjs";
import {Compterendu} from "../models/compterendu.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class AlerteService extends ResourceService<Alerte> implements OnDestroy{
  currentCRSubject: BehaviorSubject<any>;
  constructor(private http: HttpClient) {
    super(http,Alerte,`${environment.apiUrl}/alertes`);
    this.API_URL = `${environment.apiUrl}/alertes`;
    this.currentCRSubject = new BehaviorSubject<any>(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Alerte>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }

  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  get currentCRValue(): any {
    return this.currentCRSubject.value;
  }

  set currentCRValue(cr: Compterendu) {
    this.currentCRSubject.next(cr);
  }
}

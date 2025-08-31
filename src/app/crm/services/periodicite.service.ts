import {Inject, Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Periodicite} from "../models/periodicite.model";
import {Affectation} from "../models/affectation.model";
import {EntityService} from "./entity.service";
import {DataTablesResponse} from "../models/data-tables.response.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodiciteService extends ResourceService<Periodicite> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Periodicite,`${environment.apiUrl}/periodicites`);
    this.API_URL = `${environment.apiUrl}/periodicites`;
  }
  afficherTous()
  {
    return this.http.get<Periodicite[]>(`${this.API_URL}`);
  }
  afficherListe()
  {
    return this.http.get<Periodicite[]>(`${this.API_URL}/liste`);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherTousDataTable( datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Periodicite>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

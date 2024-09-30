import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Indicateur} from "../models/indicateur.model";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {EntityService} from "./entity.service";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class IndicateurService extends ResourceService<Indicateur> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Indicateur,`${environment.apiUrl}/indicateurs`);
    this.API_URL = `${environment.apiUrl}/indicateurs`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Indicateur>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  afficherListe()
  {
    return this.http.get<Indicateur>(`${this.API_URL}/liste`);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

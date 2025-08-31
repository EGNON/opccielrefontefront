import {Inject, Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Categorie} from "../models/categorie.model";
import {TableService} from "./table.sevice";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {Compterendu} from "../models/compterendu.model";
import {EntityService} from "./entity.service";
import {Modeetablissement} from "../models/modeetablissement.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class ModeetablissementService extends ResourceService<Modeetablissement> implements OnDestroy{

  constructor(private http: HttpClient) {
    super(http,Modeetablissement,`${environment.apiUrl}/modeetablissements`);
    this.API_URL = `${environment.apiUrl}/modeetablissements`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Modeetablissement>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  afficherListe()
  {
    return this.http.get<Modeetablissement[]>(`${this.API_URL}/liste`);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

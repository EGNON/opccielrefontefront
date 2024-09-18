import {Inject, Injectable, OnDestroy} from '@angular/core';
import {ModeleObjectif} from "../models/modele-objectif.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {ModeleMsgAlerte} from "../models/modelemsgalerte.model";
import {EntityService} from "./entity.service";

@Injectable({
  providedIn: 'root'
})
export class ModeleObjectifService extends EntityService<ModeleObjectif> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/modeleobjectifs`;
  }

  ngOnDestroy(): void {
  }

  afficherTous()
  {
    return this.http.get<ModeleObjectif[]>(`${this.API_URL}`);
  }

  afficherTousDataTable(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<ModeleMsgAlerte>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }

  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

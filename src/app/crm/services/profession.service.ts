import {Inject, Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Profession} from "../models/profession.model";
import {EntityService} from "./entity.service";
import {DataTablesResponse} from "../models/data-tables.response.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService extends ResourceService<Profession> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Profession,`${environment.apiUrl}/professions`);
    this.API_URL = `${environment.apiUrl}/professions`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Profession>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
  afficherListe()
  {
    return this.http.get<Profession>(`${this.API_URL}/liste`);
  }
}

import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {Affectation} from "../models/affectation.model";
import {HttpClient} from "@angular/common/http";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {Compterendu} from "../models/compterendu.model";
import {EntityService} from "./entity.service";
import {environment} from "../../../environments/environment";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class AffectationService extends ResourceService<Affectation> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Affectation,`${environment.apiUrl}/affectations`);
    this.API_URL = `${environment.apiUrl}/affectations`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTous()
  {
    return this.http.get<Affectation[]>(`${this.API_URL}`);
  }

  datatableList(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Affectation>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }

  afficherSelonPersonnel(id:number)
  {
    return this.http.get<Affectation[]>(`${this.API_URL}`+'/etats/'+id);
  }

  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

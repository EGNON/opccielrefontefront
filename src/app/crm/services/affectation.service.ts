import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {Affectation} from "../models/affectation.model";
import {HttpClient} from "@angular/common/http";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {Compterendu} from "../models/compterendu.model";
import {EntityService} from "./entity.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AffectationService extends EntityService<Affectation> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
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

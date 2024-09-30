import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Periodicite} from "../models/periodicite.model";
import {TableService} from "./table.sevice";
import {Affectation} from "../models/affectation.model";
import {EntityService} from "./entity.service";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {Pays} from "../models/pays.model";
import {environment} from "../../../environments/environment";
import {Personnephysiquepays} from "../models/personnephysiquepays.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class PersonnephysiquepaysService extends ResourceService<Periodicite> implements OnDestroy{


  constructor(private http: HttpClient) {
    super(http,Periodicite,`${environment.apiUrl}/personnePhysiquePayss`);
    this.API_URL = `${environment.apiUrl}/personnePhysiquePayss`;
  }
  afficherTous()
  {
    return this.http.get<Affectation[]>(`${this.API_URL}`);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherTousDataTable( datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<PersonnephysiquepaysService>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
  createEJ(formData: any) {
    return this.http.post<any>(`${this.API_URL}/EJ`, formData);
  }
  afficherSolonPersonnePhysique(id: number) {
    return this.http.get<Personnephysiquepays[]>(`${this.API_URL}/personne/${id}`);
  }
}

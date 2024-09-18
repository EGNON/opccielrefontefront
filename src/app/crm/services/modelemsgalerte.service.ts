import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ModeleMsgAlerte} from "../models/modelemsgalerte.model";
import {Observable} from "rxjs";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {EntityService} from "./entity.service";

@Injectable({
  providedIn: 'root'
})
export class ModeleMsgAlerteService extends EntityService<ModeleMsgAlerte> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/modelemsgalertes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherModeleMsgAlerteSelonId(idModele:number):Observable<ModeleMsgAlerte>
  {
    return this.http.get<ModeleMsgAlerte>(environment.apiUrl + '/modelemsgalertes/'+idModele);
  }

  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<ModeleMsgAlerte>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  modifier(id:any,modele:any)
  {
    return this.http.put<ModeleMsgAlerte>(`${this.API_URL}/defaut/${id}`,modele);
  }
  afficherSelonTypeModeleEtDefaut(libelle:any)
  {
    return this.http.get<ModeleMsgAlerte>(`${this.API_URL}/defaut/${libelle}`);
  }
  afficherSelonTypeModele(libelle:any)
  {
    return this.http.get<ModeleMsgAlerte[]>(`${this.API_URL}/typemodele/${libelle}`);
  }

  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

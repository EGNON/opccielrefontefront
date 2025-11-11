import {Inject, Injectable, OnDestroy} from '@angular/core';
import {environment} from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {RDV} from "../models/rdv.model";
import {Observable} from "rxjs";
import {PageResponse} from "../models/page.response.model";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {EntityService} from "./entity.service";
import { ResourceService } from './core/resource.service';
import { ResponseModel } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class RdvService extends ResourceService<RDV> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,RDV,`${environment.apiUrl}/rdvs`);
    this.API_URL = `${environment.apiUrl}/rdvs`;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherRDVListe():Observable<PageResponse<RDV>>
  {
    return this.http.get<PageResponse<RDV>>(environment.apiUrl + '/rdvs/liste');
  }
  afficherRDVSelonModeleMsgAlerte(id:any):Observable<RDV[]>
  {
    return this.http.get<RDV[]>(this.API_URL + `/modelemsgalerte/${id}`);
  }
  afficherListe()
  {
    return this.http.get<RDV>(environment.apiUrl + '/rdvs/listerdvs');
  }
  afficherListeEtat(etat:string)
  {
    return this.http.get<any>(environment.apiUrl + `/rdvs/listerdvs/${etat}`,
      {responseType: 'blob' as any }
    );
  }
  afficherRDVSelonPersonnel(idPersonnel:number)
  {
    return this.http.get<RDV>(environment.apiUrl + `/rdvs/listerdvspersonnel/${idPersonnel}`);
  }
  afficherRDVListe2()
  {
    return this.http.get<RDV>(environment.apiUrl + `/rdvs/listerdvsetat`);
  }
  modifierUnePartieDeRDV(rdv:RDV,id:number):Observable<ResponseModel<RDV>>
  {
    return this.http.put<ResponseModel<RDV>>(environment.apiUrl + '/rdvs/reelle/'+id,rdv);
  }
  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<RDV>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

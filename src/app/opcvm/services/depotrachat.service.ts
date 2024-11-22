import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Profilcommissionsousrach} from "../models/profilcommissionsousrach.model";
import { Depotrachat } from '../models/depotrachat.model';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../crm/models/table.model';

@Injectable({ providedIn: 'root' })
export class DepotrachatService extends ResourceService<Depotrachat> {
  constructor(private http: HttpClient) {
    super(http, Depotrachat, `${environment.apiUrl}/depotrachats`);
    this.API_URL = `${environment.apiUrl}/depotrachats`;
  }
  modifier(id:any,userLogin:any){
    return this.http.put<Depotrachat>(`${this.API_URL}/${id}/${userLogin}`,null)
  }
  creer(obj:any){
    return this.http.post<Depotrachat>(`${this.API_URL}/creer`,obj)
  }
  creerOperation(id:any,userLogin:any){
    return this.http.post<Depotrachat>(`${this.API_URL}/creer/${id}/${userLogin}`,null)
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  verifierIntentionRachatRestant(idOpcvm:any,idSeance:any,codeNatureOperation:any,estVerifier:any,estVerifie1:any,estVerifie2){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}/${idSeance}/${codeNatureOperation}/${estVerifier}/${estVerifie1}/${estVerifie2}`)
  }
  afficherNbrePart(idOpcvm:any,idActionnaire:any){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}/${idActionnaire}`)
  }
  afficherFT_DepotRachat(idOpcvm:any,niveau1:any,niveau2:any){
    return this.http.get<any>(`${this.API_URL}/depotrachat/${idOpcvm}/${niveau1}/${niveau2}`)
  }
  afficherPrecalculRachat(idSeance:any,idOpcvm:any,idPersonne:any){
    return this.http.get<any>(`${this.API_URL}/precalculrachat/${idSeance}/${idOpcvm}/${idPersonne}`)
  }
  datatable_DepotRachat(resource: any,idOpcvm:any,idSeance:any,codeNatureOperation:any): Observable<ResponseModel<Depotrachat>> {
    // console.log("Resource = ", resource);
    return this.http
      .post<ResponseModel<Depotrachat>>(`${this.API_URL}/datatable/list/${idOpcvm}/${idSeance}/${codeNatureOperation}`, resource)
      ;
  }
}

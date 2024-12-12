import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Operationsouscriptionrachat} from "../models/operationsouscriptionrachat.model";
import {Operationpaiementrachat2} from "../models/operationpaiementrachat2.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ResponseModel} from "../../crm/models/table.model";
import {Depotrachat} from "../models/depotrachat.model";

@Injectable({
  providedIn: 'root'
})
export class OperationpaiementrachatService extends ResourceService<Operationpaiementrachat2>{

  constructor(private http:HttpClient) {
    super(http, Operationpaiementrachat2, `${environment.apiUrl}/operationpaiementrachats`);
    this.API_URL = `${environment.apiUrl}/operationpaiementrachats`;
  }

  precalculPaiementRachat(idOpcvm:any,idSeance:any):Observable<ResponseModel<Operationpaiementrachat2>>{
    return this.http.get<ResponseModel<Operationpaiementrachat2>>(`${this.API_URL}/${idOpcvm}/${idSeance}`);
  }
  liste(idOpcvm:any,idSeance:any):Observable<ResponseModel<Operationpaiementrachat2>>{
    return this.http.get<ResponseModel<Operationpaiementrachat2>>(`${this.API_URL}/liste/${idOpcvm}/${idSeance}`);
  }

  creer(operationPaiementRachat:any):Observable<Operationpaiementrachat2>{
    return this.http.post<Operationpaiementrachat2>(`${this.API_URL}`,operationPaiementRachat);
  }
}

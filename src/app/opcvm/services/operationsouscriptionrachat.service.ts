import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import { Operationsouscriptionrachat } from '../models/operationsouscriptionrachat.model';
import {Operationsouscriptionrachat2} from "../models/operationsouscriptionrachat2.model";

@Injectable({ providedIn: 'root' })
export class OperationsouscriptionrachatService extends ResourceService<Operationsouscriptionrachat> {
  constructor(private http: HttpClient) {
    super(http, Operationsouscriptionrachat, `${environment.apiUrl}/operationsouscriptionrachats`);
    this.API_URL = `${environment.apiUrl}/operationsouscriptionrachats`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  listeOperationSouscriptionRachat(idOpcvm:any,codeNatureOperation:any,beginEndDate:any){
    return this.http.post<any>(`${this.API_URL}/${idOpcvm}/${codeNatureOperation}`,beginEndDate)
  }
  avisOperation(idOperation:any){
      return this.http.get<any>(`${this.API_URL}/avisoperation/${idOperation}`)
  }

  creer(operationSouscriptionRachat:any){
    return this.http.post<Operationsouscriptionrachat2>(`${this.API_URL}/creer`,operationSouscriptionRachat)
  }

  listeOpSousRach(parameters: any) {
    return this.http.post<any>(`${this.API_URL}/liste/opsousrach/datatable`, parameters)
  }
}

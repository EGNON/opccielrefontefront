import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import { Operationsouscriptionrachat } from '../models/operationsouscriptionrachat.model';
import {Operationsouscriptionrachat2} from "../models/operationsouscriptionrachat2.model";
import {Operationdetachement} from "../models/operationdetachement.model";

@Injectable({ providedIn: 'root' })
export class OperationdetachementdroitService extends ResourceService<any> {
  constructor(private http: HttpClient) {
    super(http, Operationdetachement, `${environment.apiUrl}/operationdetachementdroits`);
    this.API_URL = `${environment.apiUrl}/operationdetachementdroits`;
  }
  afficherTous(idOpcvm:any,idTitre:any){
    return this.http.get<any>(`${this.API_URL}/tous/${idOpcvm}/${idTitre}`)
  }
  valeurOuQte(operationDetachement:any){
    return this.http.post<any>(`${this.API_URL}/valeurouqte`,operationDetachement)
  }
  modifier(operationDetachement:any){
    return this.http.put<any>(`${this.API_URL}`,operationDetachement)
  }
  supprimer(userLogin:any,id:any){
    return this.http.delete<any>(`${this.API_URL}/${userLogin}/${id}`)
  }
  afficherTitre(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}

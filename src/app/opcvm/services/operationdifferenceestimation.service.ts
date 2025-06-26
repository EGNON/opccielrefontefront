import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import { Operationsouscriptionrachat } from '../models/operationsouscriptionrachat.model';
import {Operationsouscriptionrachat2} from "../models/operationsouscriptionrachat2.model";
import {Operationdetachement} from "../models/operationdetachement.model";

@Injectable({ providedIn: 'root' })
export class OperationdifferenceestimationService extends ResourceService<any> {
  constructor(private http: HttpClient) {
    super(http, Operationdetachement, `${environment.apiUrl}/operationdifferenceestimations`);
    this.API_URL = `${environment.apiUrl}/operationdifferenceestimations`;
  }
  afficherTous(parameters:any){
    return this.http.post<any>(`${this.API_URL}/datatable/list`, parameters);

  }
  afficherListe(idOpcvm:any,idSeance){
    return this.http.get<any>(`${this.API_URL}/tous/${idOpcvm}/${idSeance}`);

  }
  modifier(operationDetachement:any){
    return this.http.put<any>(`${this.API_URL}`,operationDetachement)
  }
  supprimer(userLogin:any,id:any){
    return this.http.delete<any>(`${this.API_URL}/${userLogin}/${id}`)
  }
  afficherTitre(idOpcvm:any,dateEstimation:any,typeEvenement:any){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}/${dateEstimation}/${typeEvenement}`)
  }
}

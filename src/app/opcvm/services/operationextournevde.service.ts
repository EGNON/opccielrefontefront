import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import { Operationsouscriptionrachat } from '../models/operationsouscriptionrachat.model';
import {Operationsouscriptionrachat2} from "../models/operationsouscriptionrachat2.model";
import {Operationdetachement} from "../models/operationdetachement.model";
import {Operationextournevde} from "../models/operationextournevde.model";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class OperationextournevdeService extends ResourceService<Operationextournevde> {
  constructor(private http: HttpClient) {
    super(http, Operationextournevde, `${environment.apiUrl}/operationextournevdes`);
    this.API_URL = `${environment.apiUrl}/operationextournevdes`;
  }
  afficherTous(parameters:any){
      return this.http.post<any>(`${this.API_URL}/datatable/list`, parameters);

  }
  verifVDE(idSeance:any,idOpcvm:any,estVerifie:any,estVerifie1:any,estVerifie2:any,niveau:any){
      return this.http.get<any>(`${this.API_URL}/jasperpdf/vde/${idSeance}/${idOpcvm}/${estVerifie}/${estVerifie1}/${estVerifie2}/${niveau}`);

  }
  excelVDE(idSeance:any,idOpcvm:any,estVerifie:any,estVerifie1:any,estVerifie2:any,niveau:any):Observable<Blob>{
      return this.http.get<any>(`${this.API_URL}/excel/vde/${idSeance}/${idOpcvm}/${estVerifie}/${estVerifie1}/${estVerifie2}/${niveau}`,{
        responseType: 'blob' as 'json' // 🔑 très important
      });

  }
  soldeCompteExtourne(obj:any){
      return this.http.post<any>(`${this.API_URL}/jasperpdf/vde/soldecompteextourne`,obj);

  }
  modifier(operationEtourneVDE:any,niveau:any){
    return this.http.put<any>(`${this.API_URL}/creerverif/${niveau}`,operationEtourneVDE)
  }
  supprimer(userLogin:any,id:any){
    return this.http.delete<any>(`${this.API_URL}/${userLogin}/${id}`)
  }
  afficherTitre(idOpcvm:any,dateEstimation:any,typeEvenement:any){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}/${dateEstimation}/${typeEvenement}`)
  }
}

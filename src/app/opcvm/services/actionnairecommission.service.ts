import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Actionnairecommission} from "../models/actionnairecommission.model";

@Injectable({ providedIn: 'root' })
export class ActionnairecommissionService extends ResourceService<Actionnairecommission> {
  constructor(private http: HttpClient) {
    super(http, Actionnairecommission, `${environment.apiUrl}/actionnairecommissions`);
    this.API_URL = `${environment.apiUrl}/actionnairecommissions`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonId(idPersonne:any,idOpcvm:any,typeCommission:any){
    return this.http.get<any>(`${this.API_URL}/${idPersonne}/${idOpcvm}/${typeCommission}`)
  }
  modifier(idPersonne:any,idOpcvm:any,typeCommission:any,actionnaireCommission:any){
    return this.http.put<any>(`${this.API_URL}/${idPersonne}/${idOpcvm}/${typeCommission}`,actionnaireCommission)
  }
  supprimer(idPersonne:any,idOpcvm:any,typeCommission:any){
    return this.http.delete<any>(`${this.API_URL}/${idPersonne}/${idOpcvm}/${typeCommission}`)
  }
}

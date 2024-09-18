import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Profilcommissionsousrach} from "../models/profilcommissionsousrach.model";

@Injectable({ providedIn: 'root' })
export class ProfilcommissionsousrachService extends ResourceService<Profilcommissionsousrach> {
  constructor(private http: HttpClient) {
    super(http, Profilcommissionsousrach, `${environment.apiUrl}/profilcommissionsousrachs`);
    this.API_URL = `${environment.apiUrl}/profilcommissionsousrachs`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  supprimer(codeProfil:any,idOpcvm:any){
    return this.http.delete<any>(`${this.API_URL}/${codeProfil}/${idOpcvm}`)
  }
  modifier(codeProfil:any,idOpcvm:any,profilCOmmissionSousRach:any){
    return this.http.put<any>(`${this.API_URL}/${codeProfil}/${idOpcvm}`,profilCOmmissionSousRach)
  }
  afficherSelonProfilOpcvm(codeProfil:any,idOpcvm:any){
    return this.http.get<any>(`${this.API_URL}/${codeProfil}/${idOpcvm}`)
  }
  afficherSelonTypeCommissionOpcvm(typeCommission:any,idOpcvm:any){
    return this.http.get<any>(`${this.API_URL}/liste/${typeCommission}/${idOpcvm}`)
  }
}

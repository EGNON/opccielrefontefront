import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Detailprofil} from "../models/detailprofil.model";

@Injectable({ providedIn: 'root' })
export class DetailprofilService extends ResourceService<Detailprofil> {
  constructor(private http: HttpClient) {
    super(http, Detailprofil, `${environment.apiUrl}/detailprofils`);
    this.API_URL = `${environment.apiUrl}/detailprofils`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
  supprimer(codeProfil:any,idOpcvm:any){
    return this.http.delete<any>(`${this.API_URL}/${codeProfil}/${idOpcvm}`)
  }
  afficherSelonProfilOpcvm(codeProfil:any,idOpcvm:any){
    return this.http.get<any>(`${this.API_URL}/${codeProfil}/${idOpcvm}`)
  }
}

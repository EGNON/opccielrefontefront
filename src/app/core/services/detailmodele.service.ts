import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Detailmodele} from "../models/detailmodele.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DetailmodeleService extends ResourceService<Detailmodele>{
  constructor(private http: HttpClient) {
    super(http, Detailmodele, '');
    this.API_URL = `${environment.apiUrl}/detailmodeles`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonModeleEcriture(code:string){
    return this.http.get<any>(`${this.API_URL}/${code}`)
  }
  afficherSelonModeleEcritureParProjection(code:string){
    return this.http.get<any>(`${this.API_URL}/projection/${code}`)
  }
  supprimerSelonModeleEcriture(code:string){
    return this.http.delete<any>(`${this.API_URL}/${code}`)
  }
  enregistrer(detailModele:Detailmodele[]){
    return this.http.post<any>(`${this.API_URL}/group`,detailModele)
  }
}

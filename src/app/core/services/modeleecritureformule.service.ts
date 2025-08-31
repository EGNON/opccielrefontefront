import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Modeleecritureformule} from "../models/modeleecritureformule.model";

@Injectable({
  providedIn: 'root'
})
export class ModeleecritureformuleService extends ResourceService<Modeleecritureformule>{
  constructor(private http: HttpClient) {
    super(http, Modeleecritureformule, '');
    this.API_URL = `${environment.apiUrl}/modeleecritureformules`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonModeleEcriture(code:string){
    return this.http.get<any>(`${this.API_URL}/${code}`)
  }
  supprimerSelonModeleEcriture(code:string){
    return this.http.delete<any>(`${this.API_URL}/${code}`)
  }
}

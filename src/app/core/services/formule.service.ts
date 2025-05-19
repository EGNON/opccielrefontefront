import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Formule} from "../models/formule";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FormuleService extends ResourceService<Formule>{
  constructor(private http: HttpClient) {
    super(http, Formule, '');
    this.API_URL = `${environment.apiUrl}/formules`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  soldeCompteFormule(soldeCompteFormule:any){
    return this.http.post<any>(`${this.API_URL}/soldecompteformule`,soldeCompteFormule)
  }
  cump(idOpcvm:any,idTitre:any,dateEstimation:any){
    return this.http.get<any>(`${this.API_URL}/cump/${idOpcvm}/${idTitre}/${dateEstimation}`)
  }
  quantiteReel(entity:any){
    return this.http.post<any>(`${this.API_URL}/quantitereel`,entity)
  }
  derniereEcheance(entity:any){
    return this.http.post<any>(`${this.API_URL}/derniereecheance`,entity)
  }
}

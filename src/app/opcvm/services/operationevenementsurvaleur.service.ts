import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import { Operationsouscriptionrachat } from '../models/operationsouscriptionrachat.model';
import {Operationsouscriptionrachat2} from "../models/operationsouscriptionrachat2.model";
import {Operationevenementsurvaleur} from "../models/operationevenementsurvaleur.model";

@Injectable({ providedIn: 'root' })
export class OperationevenementsurvaleurService extends ResourceService<Operationevenementsurvaleur> {
  constructor(private http: HttpClient) {
    super(http, Operationevenementsurvaleur, `${environment.apiUrl}/operationevenementsurvaleurs`);
    this.API_URL = `${environment.apiUrl}/operationevenementsurvaleurs`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  valeurOuQte(operationevenementsurvaleur:any){
    return this.http.post<any>(`${this.API_URL}/valeurouqte`,operationevenementsurvaleur)
  }
  modifier(operationevenementsurvaleur:any){
    return this.http.put<any>(`${this.API_URL}`,operationevenementsurvaleur)
  }
  supprimer(userLogin:any,id:any){
    return this.http.delete<any>(`${this.API_URL}/${userLogin}/${id}`)
  }
  afficherTitre(idOpcvm:any,dateEstimation:any,typeEvenement:any){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}/${dateEstimation}/${typeEvenement}`)
  }
}

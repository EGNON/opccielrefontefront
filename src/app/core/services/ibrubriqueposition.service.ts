import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Ibrubriqueposition} from "../models/ibrubriqueposition";

@Injectable({ providedIn: 'root' })
export class IbrubriquepositionService extends ResourceService<Ibrubriqueposition> {
  constructor(private http: HttpClient) {
    super(http, Ibrubriqueposition, `${environment.apiUrl}/ibrubriquepositions`);
    this.API_URL = `${environment.apiUrl}/ibrubriquepositions`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonId(codeIB:string,codeRubrique:string,codePosition:string){
    return this.http.get<any>(`${this.API_URL}/${codeIB}/${codeRubrique}/${codePosition}`)
  }
  modifier(codeIb:string,codeRubrique:string,codePosition:string,entity:any){
    return this.http.put<any>(`${this.API_URL}/${codeIb}/${codeRubrique}/${codePosition}`,entity)
  }
  supprimer(codeIb:string,codeRubrique:string,codePosition:string){
    return this.http.delete<any>(`${this.API_URL}/${codeIb}/${codeRubrique}/${codePosition}`)
  }
}

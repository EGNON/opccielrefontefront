import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Ibrubrique} from "../models/ibrubrique";

@Injectable({ providedIn: 'root' })
export class IbrubriqueService extends ResourceService<Ibrubrique> {
  constructor(private http: HttpClient) {
    super(http, Ibrubrique, `${environment.apiUrl}/ibrubriques`);
    this.API_URL = `${environment.apiUrl}/ibrubriques`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonId(codeIB:string,codeRubrique:string){
    return this.http.get<any>(`${this.API_URL}/${codeIB}/${codeRubrique}`)
  }
  modifier(codeIb:string,codeRubrique:string,entity:any){
    return this.http.put<any>(`${this.API_URL}/${codeIb}/${codeRubrique}`,entity)
  }
  supprimer(codeIb:string,codeRubrique:string){
    return this.http.delete<any>(`${this.API_URL}/${codeIb}/${codeRubrique}`)
  }
}

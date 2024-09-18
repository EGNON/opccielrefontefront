import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Postecomptable} from "../models/postecomptable.model";

@Injectable({ providedIn: 'root' })
export class PostecomptableService extends ResourceService<Postecomptable> {
  constructor(private http: HttpClient) {
    super(http, Postecomptable, `${environment.apiUrl}/postecomptables`);
    this.API_URL = `${environment.apiUrl}/postecomptables`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonCode(code:string){
    return this.http.get<any>(`${this.API_URL}/${code}`)
  }
  modifier(codePlan:string,codePosteComptable:string,posteComptable:any){
    return this.http.put<any>(`${this.API_URL}/${codePlan}/${codePosteComptable}`,posteComptable)
  }
  supprimer(codePlan:string,codePosteComptable:string){
    return this.http.delete<any>(`${this.API_URL}/${codePlan}/${codePosteComptable}`)
  }
}

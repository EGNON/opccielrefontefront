// import {Inject, Injectable, OnDestroy} from '@angular/core';
// import {HttpClient} from "@angular/common/http";
// import {environment} from "../../../environments/environment";
// import {Degre} from "../models/degre.model";
// import {TableService} from "./table.sevice";
// import {DataTablesResponse} from "../models/data-tables.response.model";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class DegreService extends TableService<Degre> implements OnDestroy{
//
//   API_URL = `${environment.apiUrl}/degres`;
//   constructor(@Inject(HttpClient) http: HttpClient) {
//     super(http);
//   }
//
//   ngOnDestroy(): void {
//     this.subscriptions.forEach(sb => sb.unsubscrCorrespondancee());
//   }
//
//   afficherTous(datatableRequest: any)
//   {
//     return this.http.post<any>(`${this.API_URL}/datatable/list`, datatableRequest);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Compartiment} from "../models/compartiment.model";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Correspondance} from "../models/correspondance.model";

@Injectable({ providedIn: 'root' })
export class CorrespondanceService extends ResourceService<Correspondance> {
  constructor(private http: HttpClient) {
    super(http, Correspondance, `${environment.apiUrl}/correspondances`);
    this.API_URL = `${environment.apiUrl}/correspondances`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonId(codeIB:string,codeRubrique:string,codePosition:string,codePlan:string,numCompteComptable:string){
    return this.http.get<any>(`${this.API_URL}/${codeIB}/${codeRubrique}/${codePosition}/${codePlan}/${numCompteComptable}`)
  }
  modifier(codeIb:string,codeRubrique:string,codePosition:string,codePlan:string,numCompteComptable:string,entity:any){
    return this.http.put<any>(`${this.API_URL}/${codeIb}/${codeRubrique}/${codePosition}/${codePlan}/${numCompteComptable}`,entity)
  }
  supprimer(codeIb:string,codeRubrique:string,codePosition:string,codePlan:string,numCompteComptable:string){
    return this.http.delete<any>(`${this.API_URL}/${codeIb}/${codeRubrique}/${codePosition}/${codePlan}/${numCompteComptable}`)
  }
}

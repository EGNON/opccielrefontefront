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
//     this.subscriptions.forEach(sb => sb.unsubscribe());
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
import {Typeoperation} from "../models/typeoperation.model";
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

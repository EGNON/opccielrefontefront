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
//     this.subscriptions.forEach(sb => sb.unsubscrIbrubriquee());
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

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
import {Compartiment} from "../../core/models/compartiment.model";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Detailprofil} from "../models/detailprofil.model";

@Injectable({ providedIn: 'root' })
export class DetailprofilService extends ResourceService<Detailprofil> {
  constructor(private http: HttpClient) {
    super(http, Detailprofil, `${environment.apiUrl}/detailprofils`);
    this.API_URL = `${environment.apiUrl}/detailprofils`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
  supprimer(codeProfil:any,idOpcvm:any){
    return this.http.delete<any>(`${this.API_URL}/${codeProfil}/${idOpcvm}`)
  }
  afficherSelonProfilOpcvm(codeProfil:any,idOpcvm:any){
    return this.http.get<any>(`${this.API_URL}/${codeProfil}/${idOpcvm}`)
  }
}

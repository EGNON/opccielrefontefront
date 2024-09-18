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
import {Natureoperation} from "../models/natureoperation.model";

@Injectable({ providedIn: 'root' })
export class NatureoperationService extends ResourceService<Natureoperation> {
  constructor(private http: HttpClient) {
    super(http, Natureoperation, `${environment.apiUrl}/natureoperations`);
    this.API_URL = `${environment.apiUrl}/natureoperations`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonTypeOperation(code:string){
    return this.http.get<any>(`${this.API_URL}/typeoperation/${code}`)
  }
}

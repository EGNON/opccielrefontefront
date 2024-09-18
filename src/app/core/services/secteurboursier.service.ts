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
import {Natureevenement} from "../models/natureevenement.model";
import {Secteurboursier} from "../models/secteurboursier.model";

@Injectable({ providedIn: 'root' })
export class SecteurboursierService extends ResourceService<Secteurboursier> {
  constructor(private http: HttpClient) {
    super(http, Secteurboursier, `${environment.apiUrl}/secteurboursiers`);
    this.API_URL = `${environment.apiUrl}/secteurboursiers`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
}

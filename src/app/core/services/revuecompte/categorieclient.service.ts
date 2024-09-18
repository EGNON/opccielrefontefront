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
import {environment} from "../../../../environments/environment";
import {Compartiment} from "../../models/compartiment.model";
import {ResourceService} from "../../../crm/services/core/resource.service";
import {Natureevenement} from "../../models/natureevenement.model";
import {Place} from "../../models/place.model";
import {Categorieclient} from "../../models/revuecompte/categorieclient.model";

@Injectable({ providedIn: 'root' })
export class CategorieclientService extends ResourceService<Categorieclient> {
  constructor(private http: HttpClient) {
    super(http, Categorieclient, `${environment.apiUrl}/categorieclients`);
    this.API_URL = `${environment.apiUrl}/categorieclients`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}

// import {Inject, Injectable, OnDestroy} from '@angular/core';
// import {Httpcompte} from "@angular/common/http";
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
//   constructor(@Inject(Httpcompte) http: Httpcompte) {
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
import {ResourceService} from "../../../crm/services/core/resource.service";
import {Soustypecompte} from "../../models/revuecompte/soustypecompte.model";

@Injectable({ providedIn: 'root' })
export class SoustypecompteService extends ResourceService<Soustypecompte> {
  constructor(private http: HttpClient) {
    super(http, Soustypecompte, `${environment.apiUrl}/soustypecomptes`);
    this.API_URL = `${environment.apiUrl}/soustypecomptes`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}

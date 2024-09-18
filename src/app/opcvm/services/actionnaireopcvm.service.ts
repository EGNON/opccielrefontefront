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
import {Natureevenement} from "../../core/models/natureevenement.model";
import {Soustypeaction} from "../../core/models/soustypeaction.model";
import {Typeaction} from "../../core/models/typeaction.model";
import {Typeemetteur} from "../../core/models/typeemetteur.model";
import {Place} from "../../core/models/place.model";
import {Banque} from "../../core/models/banque.model";
import {Actionnaireopcvm} from "../models/actionnaireopcvm.model";

@Injectable({ providedIn: 'root' })
export class ActionnaireopcvmService extends ResourceService<Actionnaireopcvm> {
  constructor(private http: HttpClient) {
    super(http, Actionnaireopcvm, `${environment.apiUrl}/actionnaireopcvms`);
    this.API_URL = `${environment.apiUrl}/actionnaireopcvms`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
  supprimer(idPersonne:any,idOpcvm:any){
    return this.http.delete<any>(`${this.API_URL}/${idPersonne}/${idOpcvm}`)
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Profilcommissionsousrach} from "../models/profilcommissionsousrach.model";
import { Depotrachat } from '../models/depotrachat.model';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../crm/models/table.model';

@Injectable({ providedIn: 'root' })
export class DepotrachatService extends ResourceService<Depotrachat> {
  constructor(private http: HttpClient) {
    super(http, Depotrachat, `${environment.apiUrl}/depotrachats`);
    this.API_URL = `${environment.apiUrl}/depotrachats`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherNbrePart(idOpcvm:any,idActionnaire:any){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}/${idActionnaire}`)
  }
  datatable_DepotRachat(resource: any,idOpcvm:any,idSeance:any,codeNatureOperation:any): Observable<ResponseModel<Depotrachat>> {
    // console.log("Resource = ", resource);
    return this.http
      .post<ResponseModel<Depotrachat>>(`${this.API_URL}/datatable/list/${idOpcvm}/${idSeance}/${codeNatureOperation}`, resource)
      // .pipe(
      //   tap(resp => console.log("Data", resp))
      // )
      ;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Profilcommissionsousrach} from "../models/profilcommissionsousrach.model";
import { Depotrachat } from '../models/depotrachat.model';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../crm/models/table.model';
import { Seanceopcvm } from '../models/seanceopcvm.model';

@Injectable({ providedIn: 'root' })
export class SeanceopcvmService extends ResourceService<Seanceopcvm> {
  constructor(private http: HttpClient) {
    super(http, Seanceopcvm, `${environment.apiUrl}/seanceopcvms`);
    this.API_URL = `${environment.apiUrl}/seanceopcvms`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }

  afficherTousDataTable(datatableRequest:any){
    return this.http.post<any>(`${this.API_URL}/datatable/list`,datatableRequest)
  }
  afficherSeanceEnCours(idOpcvm:any){
    return this.http.get<any>(`${this.API_URL}/encours/${idOpcvm}`)
  }

  listeSeanceOpcvm(params: any, idOpcvm) {
    return this.http.post<any>(`${this.API_URL}/liste/seance/opcvm-${idOpcvm}`, params);
  }
  listeSeanceOpcvmDesc(idOpcvm:any) {
    return this.http.get<any>(`${this.API_URL}/listedesc/${idOpcvm}`);
  }
  afficherSelonId(idOpcvm:any,idSeance:any) {
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}/${idSeance}`);
  }
  modifier(idOpcvm:any,idSeance:any,navbenchmark:any,entity:any) {
    return this.http.put<any>(`${this.API_URL}/${idOpcvm}/${idSeance}/${navbenchmark}`,entity);
  }
}

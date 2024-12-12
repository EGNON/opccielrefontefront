import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Seanceopcvm} from "../models/seanceopcvm.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OperationrestitutionreliquatService extends ResourceService<any> {
  constructor(private http: HttpClient) {
    super(http, Seanceopcvm, `${environment.apiUrl}/restitutionreliquats`);
    this.API_URL = `${environment.apiUrl}/restitutionreliquats`;
  }

  listeOperationRestitution(parameters: any, idOpcvm: number, idSeance: any) {
    return this.http.post<any>(`${this.API_URL}/liste/${idOpcvm}-${idSeance}`, parameters);
  }

  precalculRestitutionReliquat(parameters: any, idOpcvm: number, idSeance: any) {
    return this.http.post<any>(`${this.API_URL}/precalcul/restitution/${idOpcvm}-${idSeance}`, parameters);
  }

  enregistrerTous(data: any) {
    return this.http.post<any>(`${this.API_URL}/enregistrer/restitution/reliquat`, data);
  }
}

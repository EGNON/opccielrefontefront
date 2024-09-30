import {Inject, Injectable, OnDestroy} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Compterendu} from "../models/compterendu.model";
import {EntityService} from "./entity.service";
import {DataTablesResponse} from "../models/data-tables.response.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class CompterenduService extends ResourceService<Compterendu> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Compterendu,`${environment.apiUrl}/compterendus`);
    this.API_URL = `${environment.apiUrl}/compterendus`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  validateCR(id: number, request: any)
  {
    return this.http.post<Compterendu>(`${this.API_URL}/validate-${id}`, request);
  }

  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Compterendu>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  afficherCompteRenduSelonUtilisateur(idUtilisateur: number)
  {
    return this.http.get<Compterendu[]>(`${this.API_URL}/liste/`+idUtilisateur);
  }
  afficherCompteRenduTous()
  {
    return this.http.get<Compterendu[]>(`${this.API_URL}/etats/tous`);
  }
  afficherCompteRendu()
  {
    return this.http.get<Compterendu[]>(`${this.API_URL}`);
  }
  afficherCompteRenduSelonRealisation(idUtilisateur:number,dateDeb:Date,dateFin:Date)
  {
    return this.http.get<Compterendu[]>(`${this.API_URL}/realisation/`+idUtilisateur+"/"+dateDeb+"/"+dateFin);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  createFn(formData: any) {
    return this.http.post<any>(`${this.API_URL}/uploads/file`, formData);
  }

  updateFn(formData: any, id: any) {
    return this.http.put<any>(`${this.API_URL}/uploads/file-${id}`, formData);
  }
}

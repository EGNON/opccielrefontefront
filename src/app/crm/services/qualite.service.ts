import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Qualite} from "../models/qualite.model";
import {environment} from "../../../environments/environment";
import {TableService} from "./table.sevice";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {ResponseModel} from "../models/table.model";

@Injectable({
  providedIn: 'root'
})
export class QualiteService extends TableService<Qualite> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/qualites`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherListe(phOrPm: boolean = true) {
    return this.http.post<ResponseModel<Qualite>>(`${this.API_URL}/tous/${phOrPm}`, null);
  }

  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Qualite>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }

  afficherTousPh(idPersonne: number)
  {
    return this.http.post<ResponseModel<Qualite>>(`${this.API_URL}/datatable/list-ph/${idPersonne}`, null);
  }

  afficherTousPm(idPersonne: number)
  {
    return this.http.post<DataTablesResponse<Qualite>>(`${this.API_URL}/datatable/list-pm/${idPersonne}`, null);
  }

  afficherSelonLibelle(libelleQualite: any)
  {
    return this.http.get<Qualite>(`${this.API_URL}/qualite/${libelleQualite}`);
  }
}

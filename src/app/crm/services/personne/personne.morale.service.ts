import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "../table.sevice";
import {HttpClient} from "@angular/common/http";
import {PersonneMorale} from "../../models/personne/personne.morale.model";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {DataTablesResponse} from "../../models/table.model";

@Injectable({
  providedIn: 'root'
})
export class PersonneMoraleService extends TableService<PersonneMorale> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/personnemorales`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getEntityById(id: any): Observable<PersonneMorale> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<PersonneMorale>(url);
  }

  getPersonnes(dataTablesParameters: any, keyword: any): Observable<DataTablesResponse<any>> {
    const url = `${this.API_URL}/datatable-${keyword}/list`;
    return this.http.post<DataTablesResponse<any>>(url, dataTablesParameters);
  }
  getPersonneSanctionnee(dataTablesParameters: any): Observable<DataTablesResponse<any>> {
    const url = `${this.API_URL}/datatable/moralesanctionnee`;
    return this.http.post<DataTablesResponse<any>>(url, dataTablesParameters);
  }
  afficherPersonneSelonQualite = (keyword: any) => {
    const url = `${this.API_URL}/qualite/${keyword}`;
    return this.http.get<PersonneMorale[]>(url);
  }
  afficherPersonneMoraleNayantPasInvesti (qualite: string,dateDebut:Date,dateFin:Date )  {
    const url = `${this.API_URL}/investi/`+qualite+'/'+dateDebut+'/'+dateFin;
    return this.http.get<PersonneMorale[]>(url);
  }
  afficherPersonneMoraleSelonId(id:number):Observable<PersonneMorale>
  {
    return this.http.get<PersonneMorale>(environment.apiUrl + '/personnemorales/'+id);
  }
  deleteByPersonneAndQualite(idPersonne:number,idQualite:number):Observable<PersonneMorale>
  {
    return this.http.delete<PersonneMorale>(environment.apiUrl + `/personnemorales/${idPersonne}/${idQualite}`);
  }
}

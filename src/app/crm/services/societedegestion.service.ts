import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TableService} from "./table.sevice";
import {environment} from "../../../environments/environment";
import {DataTablesResponse} from "../models/table.model";
import {SocieteDeGestion} from "../models/societedegestion.model";


@Injectable({
  providedIn: 'root'
})
export class SocieteDeGestionService extends TableService<SocieteDeGestion> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/societedegestions`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getEntityById(id: any): Observable<SocieteDeGestion> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<SocieteDeGestion>(url);
  }

  getSocieteDeGestion(dataTablesParameters: any): Observable<DataTablesResponse<any>> {
    const url = `${this.API_URL}/datatable/list`;
    return this.http.post<DataTablesResponse<any>>(url, dataTablesParameters);
  }

  afficherSocieteDeGestionSelonId(id:number):Observable<SocieteDeGestion>
  {
    return this.http.get<SocieteDeGestion>(environment.apiUrl + '/societedegestions/'+id);
  }
  supprimer(id:number){
    return this.http.delete<SocieteDeGestion>(environment.apiUrl + '/societedegestions/'+id)
  }
}

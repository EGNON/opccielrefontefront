import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Pays} from "../models/pays.model";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {EntityService} from "./entity.service";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class PaysService extends ResourceService<Pays> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Pays,`${environment.apiUrl}/pays`);
    this.API_URL = `${environment.apiUrl}/pays`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherListe()
  {
    return this.http.get<Pays[]>(environment.apiUrl + '/pays/liste');
  }
  afficherPaysListe():Observable<Pays>
  {
    return this.http.get<Pays>(environment.apiUrl + '/pays/liste');
  }
  afficherPaysGafiOuNon():Observable<Pays[]>
  {
    return this.http.get<Pays[]>(environment.apiUrl + '/pays/liste');
  }
  afficherPaysListeSelonEstGafi(estGafi:boolean):Observable<Pays[]>
  {
    return this.http.get<Pays[]>(environment.apiUrl + `/pays/liste/${estGafi}`);
  }
  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Pays>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

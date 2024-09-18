import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Monnaie} from "../models/monnaie.model";
import {Observable} from "rxjs";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {EntityService} from "./entity.service";

@Injectable({
  providedIn: 'root'
})
export class MonnaieService extends EntityService<Monnaie> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/monnaies`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherMonnaieListe():Observable<Monnaie>
  {
    return this.http.get<Monnaie>(environment.apiUrl + '/monnaies/liste');
  }
  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Monnaie>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

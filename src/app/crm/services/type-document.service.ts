import {Inject, Injectable, OnDestroy} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TypeDocument} from "../models/type-document.model";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {Typedocument} from "../models/typedocument.model";
import {EntityService} from "./entity.service";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService extends ResourceService<TypeDocument> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Typedocument,`${environment.apiUrl}/typedocuments`);
    this.API_URL = `${environment.apiUrl}/typedocuments`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTous()
  {
    const url = `${this.API_URL}/tous`;
    return this.http.get<TypeDocument[]>(url);
  }
  afficherTousDataTable(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Typedocument>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}

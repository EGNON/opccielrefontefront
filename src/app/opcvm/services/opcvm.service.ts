import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ResponseModel} from "../../crm/models/table.model";
import {DataTablesResponse} from "../../crm/models/data-tables.response.model";

@Injectable({
  providedIn: 'root'
})
export class OpcvmService {
  API_URL = `${environment.apiUrl}/opcvms`;

  constructor(private http: HttpClient) { }

  listeOpcvm(datatableRequest: any) {
    return this.http.post<any>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
}

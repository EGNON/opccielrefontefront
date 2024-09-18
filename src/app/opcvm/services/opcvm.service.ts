import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

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

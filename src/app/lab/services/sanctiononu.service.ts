import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import { SanctionOnu } from '../models/sanctiononu.model';
// import {Charge} from "../models/charge.model";

@Injectable({ providedIn: 'root' })
export class SanctionOnuService extends ResourceService<SanctionOnu> {
  constructor(private http: HttpClient) {
    super(http, SanctionOnu, `${environment.apiUrl}/sanctiononus`);
    this.API_URL = `${environment.apiUrl}/sanctiononus`;
  }
  afficherTous(param:any){
    return this.http.post<any>(`${this.API_URL}`,param)
  }
}

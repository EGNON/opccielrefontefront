import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Ib} from "../models/ib";

@Injectable({ providedIn: 'root' })
export class IbService extends ResourceService<Ib> {
  constructor(private http: HttpClient) {
    super(http, Ib, `${environment.apiUrl}/ibs`);
    this.API_URL = `${environment.apiUrl}/ibs`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}

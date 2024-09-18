import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Charge} from "../models/charge.model";

@Injectable({ providedIn: 'root' })
export class ChargeService extends ResourceService<Charge> {
  constructor(private http: HttpClient) {
    super(http, Charge, `${environment.apiUrl}/charges`);
    this.API_URL = `${environment.apiUrl}/charges`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }

}

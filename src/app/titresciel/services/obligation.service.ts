import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {ObligationModel} from "../models/obligation.model";
import { HttpClient } from "@angular/common/http";
import {TitreModel} from "../models/titre.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ObligationService extends ResourceService<ObligationModel>{
  constructor(private http: HttpClient) {
    super(http, ObligationModel, `${environment.apiUrl}/obligations`);
    this.API_URL = `${environment.apiUrl}/obligations`;
  }

  creerFn(data: any) {
    return this.http.post<any>(`${this.API_URL}`, data);
  }
}

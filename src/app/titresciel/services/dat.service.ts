import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {ObligationModel} from "../models/obligation.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {DatModel} from "../models/dat.model";

@Injectable({
  providedIn: 'root'
})
export class DatService extends ResourceService<DatModel>{
  constructor(private http: HttpClient) {
    super(http, DatModel, `${environment.apiUrl}/dats`);
    this.API_URL = `${environment.apiUrl}/dats`;
  }
}

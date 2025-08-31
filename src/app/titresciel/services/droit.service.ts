import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {ObligationModel} from "../models/obligation.model";
import {DroitModel} from "../models/droit.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DroitService extends ResourceService<DroitModel>{
  constructor(private http: HttpClient) {
    super(http, DroitModel, `${environment.apiUrl}/droits`);
    this.API_URL = `${environment.apiUrl}/droits`;
  }
}

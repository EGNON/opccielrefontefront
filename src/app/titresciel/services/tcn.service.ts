import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {ObligationModel} from "../models/obligation.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TcnModel} from "../models/tcn.model";

@Injectable({
  providedIn: 'root'
})
export class TcnService extends ResourceService<TcnModel>{
  constructor(private http: HttpClient) {
    super(http, TcnModel, `${environment.apiUrl}/tcns`);
    this.API_URL = `${environment.apiUrl}/tcns`;
  }
}

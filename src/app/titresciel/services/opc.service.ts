import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {OpcModel} from "../models/opc.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OpcService extends ResourceService<OpcModel>{
  constructor(private http: HttpClient) {
    super(http, OpcModel, `${environment.apiUrl}/opcs`);
    this.API_URL = `${environment.apiUrl}/opcs`;
  }
}

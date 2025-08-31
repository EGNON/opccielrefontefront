import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {IndiceBrvmModel} from "../models/indice-brvm.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResponseModel} from "../../crm/models/table.model";

@Injectable({
  providedIn: 'root'
})
export class IndiceBrvmService extends ResourceService<IndiceBrvmModel>{
  constructor(private http: HttpClient) {
    super(http, IndiceBrvmModel, ``);
    this.API_URL = `${environment.apiUrl}/indicesbrvm`;
  }

  saveAll(indices: any[]) {
    return this.http.post<ResponseModel<any>>(`${this.API_URL}/add/collection/all`, indices);
  }
}

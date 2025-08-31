import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {NatureTcnModel} from "../models/nature-tcn.model";
import { HttpClient } from "@angular/common/http";
import {QualiteTitreModel} from "../models/qualite-titre.model";
import {environment} from "../../../environments/environment";
import {ResponseModel} from "../../crm/models/table.model";

@Injectable({
  providedIn: 'root'
})
export class NatureTcnService extends ResourceService<NatureTcnModel>{
  constructor(private http: HttpClient) {
    super(http, NatureTcnModel, ``);
    this.API_URL = `${environment.apiUrl}/naturetcns`;
  }
  afficherTous(){
    return this.http.get<ResponseModel<NatureTcnModel>>(`${this.API_URL}`);
  }
}

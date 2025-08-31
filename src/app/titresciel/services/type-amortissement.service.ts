import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TypeAmortissementModel} from "../models/type-amortissement.model";
import {ResourceService} from "../../crm/services/core/resource.service";
import {ResponseModel} from "../../crm/models/table.model";
import {ModeAmortissementModel} from "../models/mode-amortissement.model";

@Injectable({
  providedIn: 'root'
})
export class TypeAmortissementService extends ResourceService<TypeAmortissementModel>{
  constructor(private http: HttpClient) {
    super(http, TypeAmortissementModel, `${environment.apiUrl}/typeamortissements`);
    this.API_URL = `${environment.apiUrl}/typeamortissements`;
  }

  afficherTous(){
    return this.http.get<ResponseModel<ModeAmortissementModel>>(`${this.API_URL}`);
  }
}

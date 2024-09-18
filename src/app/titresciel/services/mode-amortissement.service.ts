import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {ModeAmortissementModel} from "../models/mode-amortissement.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResponseModel} from "../../crm/models/table.model";
import {QualiteTitreModel} from "../models/qualite-titre.model";

@Injectable({
  providedIn: 'root'
})
export class ModeAmortissementService extends ResourceService<ModeAmortissementModel>{
  constructor(private http: HttpClient) {
    super(http, ModeAmortissementModel, `${environment.apiUrl}/modeamortissements`);
    this.API_URL = `${environment.apiUrl}/modeamortissements`;
  }

  afficherTous(){
    return this.http.get<ResponseModel<ModeAmortissementModel>>(`${this.API_URL}`);
  }
}

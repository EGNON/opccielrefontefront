import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {ObligationModel} from "../models/obligation.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ActionModel} from "../models/action.model";
import {ResponseModel} from "../../crm/models/table.model";
import {ModeAmortissementModel} from "../models/mode-amortissement.model";

@Injectable({
  providedIn: 'root'
})
export class ActionService extends ResourceService<ActionModel>{
  constructor(private http: HttpClient) {
    super(http, ActionModel, `${environment.apiUrl}/actions`);
    this.API_URL = `${environment.apiUrl}/actions`;
  }

  afficherTous(){
    return this.http.get<ResponseModel<ActionModel>>(`${this.API_URL}`);
  }
}

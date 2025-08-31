import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {ModeCalculInteretModel} from "../models/mode-calcul-interet.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResponseModel} from "../../crm/models/table.model";

@Injectable({
  providedIn: 'root'
})
export class ModeCalculInteretService extends ResourceService<ModeCalculInteretModel>{
  constructor(private http: HttpClient) {
    super(http, ModeCalculInteretModel, ``);
    this.API_URL = `${environment.apiUrl}/modecalculinterets`;
  }

  afficherTous(){
    return this.http.get<ResponseModel<ModeCalculInteretModel>>(`${this.API_URL}`);
  }
}

import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {FormeJuridiqueOpc} from "../models/forme-juridique-opc";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResponseModel} from "../../crm/models/table.model";

@Injectable({
  providedIn: 'root'
})
export class FormeJuridiqueOpcService extends ResourceService<FormeJuridiqueOpc>{
  constructor(private http: HttpClient) {
    super(http, FormeJuridiqueOpc, '');
    this.API_URL = `${environment.apiUrl}/formejuridiqueopc`;
  }

  afficherTous(){
    return this.http.get<ResponseModel<FormeJuridiqueOpc>>(`${this.API_URL}`);
  }
}

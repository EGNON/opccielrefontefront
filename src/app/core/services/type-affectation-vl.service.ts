import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {TypeAffectationTitre} from "../models/type-affectation-vl";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResponseModel} from "../../crm/models/table.model";

@Injectable({
  providedIn: 'root'
})
export class TypeAffectationVlService extends ResourceService<TypeAffectationTitre>{
  constructor(private http: HttpClient) {
    super(http, TypeAffectationTitre, '');
    this.API_URL = `${environment.apiUrl}/titre/typeaffectations`;
  }

  afficherTous(){
    return this.http.get<ResponseModel<TypeAffectationTitre>>(`${this.API_URL}`);
  }
}

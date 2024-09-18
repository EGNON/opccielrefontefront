import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../models/opcvm";
import {ClassificationOPC} from "../models/classification-opc";
import {ResponseModel} from "../../crm/models/table.model";
import {ModeAmortissementModel} from "../../titresciel/models/mode-amortissement.model";

@Injectable({
  providedIn: 'root'
})
export class ClassificationOpcService extends ResourceService<ClassificationOPC>{
  constructor(private http: HttpClient) {
    super(http, ClassificationOPC, '');
    this.API_URL = `${environment.apiUrl}/classifications`;
  }

  afficherTous(){
    return this.http.get<ResponseModel<ClassificationOPC>>(`${this.API_URL}`);
  }
}

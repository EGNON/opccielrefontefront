import {Injectable} from "@angular/core";
import {ResourceService} from "../../crm/services/core/resource.service";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {QualiteTitreModel} from "../models/qualite-titre.model";
import {ResponseModel} from "../../crm/models/table.model";
import {Qualite} from "../../crm/models/qualite.model";

@Injectable({ providedIn: 'root' })
export class QualiteTitreService extends ResourceService<QualiteTitreModel> {
  constructor(private http: HttpClient) {
    super(http, QualiteTitreModel, `${environment.apiUrl}/qualitetitres`);
    this.API_URL = `${environment.apiUrl}/qualitetitres`;
  }
  afficherTous(){
    return this.http.get<ResponseModel<QualiteTitreModel>>(`${this.API_URL}/liste`);
  }
}

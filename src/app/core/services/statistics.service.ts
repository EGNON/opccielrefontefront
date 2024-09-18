import { Injectable } from '@angular/core';
import {getCSSVariableValue} from "../../template/_metronic/kt/_utils";
import {ResponseModel} from "../../crm/models/table.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  API_URL = `${environment.apiUrl}/statistiques`;
  constructor(private http: HttpClient) { }

  nbrePersonneParQualite(qualite: string|null) {
    return this.http.get<ResponseModel<any>>(qualite ? `${this.API_URL}/${qualite}` : `${this.API_URL}`);
  }

  nbrRdvEnCours() {
    return this.http.get<ResponseModel<any>>(`${this.API_URL}/rdv/nbrerdvencours`);
  }

  nbreRdvParMois(anneeEnCours: string) {
    return this.http.get<ResponseModel<any>>(`${this.API_URL}/nbrerdvparmois/${anneeEnCours}`);
  }

  niveauAtteinteObjectifParAgent(anneeEnCours: string) {
    return this.http.get<ResponseModel<any>>(`${this.API_URL}/objectif/niveau-evolution/${anneeEnCours}`);
  }
}
